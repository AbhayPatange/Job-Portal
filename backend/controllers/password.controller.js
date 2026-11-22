import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';

export async function forgotPassword(req, res, next) {
    try {
        const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
        if (!process.env.RESEND_API_KEY || !process.env.RESET_EMAIL_FROM || !process.env.FRONTEND_URL) {
            return res.status(503).json({ success: false, message: 'Password recovery is not available yet. Please try again later.' });
        }
        const user = await User.findOne({ email: { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
        if (user) {
            const token = crypto.randomBytes(32).toString('hex');
            const hash = crypto.createHash('sha256').update(token).digest('hex');
            await User.updateOne({ _id: user._id }, { $set: { resetTokenHash: hash, resetTokenExpires: new Date(Date.now() + 15 * 60 * 1000) } });
            const url = new URL('/reset-password', process.env.FRONTEND_URL);
            url.searchParams.set('token', token);
            try {
                const response = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ from: process.env.RESET_EMAIL_FROM, to: [user.email], subject: 'Reset your Job Portal password', text: `Reset your password using this link (expires in 15 minutes):\n${url}\n\nIf you did not request this, ignore this email.` }),
                    signal: AbortSignal.timeout(10000),
                });
                if (!response.ok) throw new Error('Email delivery failed');
            } catch {
                await User.updateOne({ _id: user._id, resetTokenHash: hash }, { $unset: { resetTokenHash: 1, resetTokenExpires: 1 } });
                console.error('Password reset email delivery failed');
            }
        }
        return res.json({ success: true, message: 'If an account exists for this email, a reset link will arrive shortly. Check your spam folder too.' });
    } catch (error) { next(error); }
}

export async function resetPassword(req, res, next) {
    try {
        const { token, password } = req.body;
        if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token) || typeof password !== 'string' || password.length < 8 || Buffer.byteLength(password) > 72) {
            return res.status(400).json({ success: false, message: 'Use a valid reset link and a password of at least 8 characters (maximum 72 bytes).' });
        }
        const hash = crypto.createHash('sha256').update(token).digest('hex');
        const encrypted = await bcrypt.hash(password, 12);
        // Atomic consumption prevents two concurrent requests from reusing a link.
        const user = await User.findOneAndUpdate({ resetTokenHash: hash, resetTokenExpires: { $gt: new Date() } }, {
            $set: { password: encrypted }, $inc: { tokenVersion: 1 }, $unset: { resetTokenHash: 1, resetTokenExpires: 1 },
        });
        if (!user) return res.status(400).json({ success: false, message: 'This reset link is invalid or expired. Request a new one.' });
        return res.json({ success: true, message: 'Password updated. Please sign in with your new password.' });
    } catch (error) { next(error); }
}
