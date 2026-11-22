import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { forgotPassword, resetPassword } from '../controllers/password.controller.js';
const response = () => ({ statusCode: 200, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
const fail = error => { throw error; };

test('reset rejects weak passwords before accessing the database', async () => {
    const res = response();
    await resetPassword({ body: { token: 'a'.repeat(64), password: 'short' } }, res, fail);
    assert.equal(res.statusCode, 400);
});

test('reset atomically consumes a hashed token and revokes previous sessions', async t => {
    const token = 'a'.repeat(64);
    let consumed = false;
    t.mock.method(User, 'findOneAndUpdate', async (query, update) => {
        assert.equal(query.resetTokenHash, crypto.createHash('sha256').update(token).digest('hex'));
        assert.ok(query.resetTokenExpires.$gt instanceof Date);
        assert.ok(await bcrypt.compare('new-password-123', update.$set.password));
        assert.equal(update.$inc.tokenVersion, 1);
        assert.equal(update.$unset.resetTokenHash, 1);
        if (consumed) return null;
        consumed = true;
        return { _id: 'user' };
    });
    const first = response();
    await resetPassword({ body: { token, password: 'new-password-123' } }, first, fail);
    assert.equal(first.body.success, true);
    const second = response();
    await resetPassword({ body: { token, password: 'new-password-123' } }, second, fail);
    assert.equal(second.statusCode, 400);
});

test('forgot password gives the same response for existing and missing users; stores no plaintext token', async t => {
    const old = { ...process.env };
    process.env.RESEND_API_KEY = 'test'; process.env.RESET_EMAIL_FROM = 'test@example.com'; process.env.FRONTEND_URL = 'https://example.com';
    t.after(() => { for (const name of ['RESEND_API_KEY','RESET_EMAIL_FROM','FRONTEND_URL']) { if (old[name] === undefined) delete process.env[name]; else process.env[name] = old[name]; } });
    let exists = true;
    let stored;
    t.mock.method(User, 'findOne', async () => exists ? { _id: 'user', email: 'test@example.com' } : null);
    t.mock.method(User, 'updateOne', async (query, update) => { stored = update.$set; });
    t.mock.method(globalThis, 'fetch', async (url, options) => {
        const content = JSON.parse(options.body);
        const token = content.text.match(/token=([a-f0-9]{64})/)[1];
        assert.notEqual(stored.resetTokenHash, token);
        assert.equal(stored.resetTokenHash, crypto.createHash('sha256').update(token).digest('hex'));
        assert.ok(stored.resetTokenExpires > new Date());
        return { ok: true };
    });
    const found = response(); await forgotPassword({ body: { email: 'test@example.com' } }, found, fail);
    exists = false;
    const missing = response(); await forgotPassword({ body: { email: 'test@example.com' } }, missing, fail);
    assert.deepEqual(found.body, missing.body);
});
