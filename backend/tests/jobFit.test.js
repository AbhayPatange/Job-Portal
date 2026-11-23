import test from 'node:test';
import assert from 'node:assert/strict';
import { generateCoverLetter, generateFit, generateInterviewPrep, redactContactDetails, validateFitResult } from '../utils/jobFit.js';

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

test('uses Groq structured output without exposing the key to clients', async () => {
    const priorKey = process.env.GROQ_API_KEY;
    process.env.GROQ_API_KEY = 'server-only-test-key';
    let request;
    const resume = 'Built accessible React dashboards and tested APIs.';
    const job = 'Requirements: React experience and API testing.';
    const result = { summary: 'The provided text shows one relevant skill.', strengths: [{ requirement: 'React', jobEvidence: 'React experience', resumeEvidence: 'React dashboards', explanation: 'Both texts mention React.' }], gaps: [], improvements: ['If true, add the dashboard outcomes.'] };
    const analysis = await generateFit(resume, job, async (url, options) => {
        request = { url, options: JSON.parse(options.body) };
        return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify(result) } }] }) };
    });
    if (priorKey === undefined) delete process.env.GROQ_API_KEY; else process.env.GROQ_API_KEY = priorKey;
    assert.equal(request.url, 'https://api.groq.com/openai/v1/chat/completions');
    assert.equal(request.options.store, false);
    assert.equal(request.options.response_format.json_schema.strict, true);
    assert.equal(analysis.summary, result.summary);
});

test('falls back to JSON object mode only when strict schema mode is rejected', async () => {
    const priorKey = process.env.GROQ_API_KEY;
    process.env.GROQ_API_KEY = 'server-only-test-key';
    let calls = 0;
    const resume = 'Built accessible React dashboards and tested APIs.';
    const job = 'Requirements: React experience and API testing.';
    const result = { summary: 'The provided text shows one relevant skill.', strengths: [{ requirement: 'React', jobEvidence: 'React experience', resumeEvidence: 'React dashboards', explanation: 'Both texts mention React.' }], gaps: [], improvements: ['If true, add the dashboard outcomes.'] };
    const analysis = await generateFit(resume, job, async (url, options) => {
        calls += 1;
        const body = JSON.parse(options.body);
        if (calls === 1) return { ok: false, status: 400, json: async () => ({}) };
        assert.equal(body.response_format.type, 'json_object');
        return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify(result) } }] }) };
    });
    if (priorKey === undefined) delete process.env.GROQ_API_KEY; else process.env.GROQ_API_KEY = priorKey;
    assert.equal(calls, 2);
    assert.equal(analysis.summary, result.summary);
});

test('creates bounded job-specific interview prep', async () => {
    const priorKey = process.env.GROQ_API_KEY;
    process.env.GROQ_API_KEY = 'server-only-test-key';
    const prep = { openingTip: 'Connect one project to the role requirements.', questions: [{ question: 'How would you design a REST API?', whyItMatters: 'The job mentions backend APIs.', answerApproach: 'Use a real project and explain tradeoffs.' }] };
    const result = await generateInterviewPrep('Requirements: backend APIs.', async () => ({ ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify(prep) } }] }) }));
    if (priorKey === undefined) delete process.env.GROQ_API_KEY; else process.env.GROQ_API_KEY = priorKey;
    assert.equal(result.questions.length, 1);
});

test('falls back to JSON mode for cover letter drafts when strict mode is rejected', async () => {
    const priorKey = process.env.GROQ_API_KEY;
    process.env.GROQ_API_KEY = 'server-only-test-key';
    let calls = 0;
    const result = await generateCoverLetter('Title: Engineer', 'Built API features.', async (url, options) => {
        calls += 1;
        const body = JSON.parse(options.body);
        if (calls === 1) return { ok: false, status: 400, json: async () => ({}) };
        assert.equal(body.response_format.type, 'json_object');
        return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify({ subject: 'Application for Engineer', draft: 'Dear Hiring Team,\n\nI am interested in the Engineer role.', editingTip: 'Add one true project outcome.' }) } }] }) };
    });
    if (priorKey === undefined) delete process.env.GROQ_API_KEY; else process.env.GROQ_API_KEY = priorKey;
    assert.equal(calls, 2);
    assert.equal(result.subject, 'Application for Engineer');
});
