import test from 'node:test';
import assert from 'node:assert/strict';
import { redactContactDetails, validateFitResult } from '../utils/jobFit.js';

test('redacts common contact and personal details before provider use', () => {
    const text = redactContactDetails('Asha Patel\nasha@example.com\n+91 98765 43210\nAddress: Pune\nPortfolio: https://example.com', { fullname: 'Asha Patel' });
    assert.equal(text.includes('asha@example.com'), false);
    assert.equal(text.includes('98765'), false);
    assert.equal(text.includes('Pune'), false);
    assert.equal(text.includes('example.com'), false);
});

test('only accepts resume and job evidence that exists in the supplied text', () => {
    const resume = 'Built accessible React dashboards and tested APIs.';
    const job = 'Requirements: React experience and API testing.';
    const valid = { summary: 'The provided text shows one relevant skill.', strengths: [{ requirement: 'React', jobEvidence: 'React experience', resumeEvidence: 'React dashboards', explanation: 'Both texts mention React.' }], gaps: [], improvements: ['If true, add the dashboard outcomes.'] };
    assert.equal(validateFitResult(valid, resume, job).strengths.length, 1);
    assert.throws(() => validateFitResult({ ...valid, strengths: [{ ...valid.strengths[0], resumeEvidence: 'Python' }] }, resume, job), /Unsupported AI evidence/);
});
