import mongoose from 'mongoose';
import { Job } from '../models/job.model.js';
import { reserveCoverLetterUsage } from '../models/aiUsage.model.js';
import { fitEnabled, generateCoverLetter, redactContactDetails } from '../utils/jobFit.js';

export async function draftCoverLetter(req, res) {
    res.set('Cache-Control', 'no-store');
    if (!fitEnabled()) return res.status(503).json({ success: false, message: 'AI cover letters are not available yet.' });
    if (req.role !== 'student') return res.status(403).json({ success: false, message: 'Cover letter drafts are available to candidate accounts.' });
    if (!mongoose.isValidObjectId(req.params.id) || req.body.consent !== true || typeof req.body.highlights !== 'string' || req.body.highlights.trim().length < 30 || req.body.highlights.length > 5000) return res.status(400).json({ success: false, message: 'Review 30–5,000 characters of your highlights and confirm consent.' });
    try {
        const job = await Job.findById(req.params.id).lean();
        if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
        if (!await reserveCoverLetterUsage(req.id)) return res.status(429).json({ success: false, message: 'Your daily cover-letter limit has been reached. Please try again tomorrow (UTC).' });
        const jobText = redactContactDetails(`Title: ${job.title}\nDescription: ${job.description}\nRequirements: ${(job.requirements || []).join('; ')}`).slice(0, 12000);
        const highlights = redactContactDetails(req.body.highlights).slice(0, 5000);
        return res.json({ success: true, letter: await generateCoverLetter(jobText, highlights), jobId: String(job._id) });
    } catch (error) { console.error('AI cover letter failed:', error.message, error.providerStatus ? `(provider status ${error.providerStatus})` : ''); return res.status(error.providerStatus === 429 ? 429 : 502).json({ success: false, message: error.providerStatus === 429 ? 'The AI service is busy. Please try again shortly.' : 'Cover letter could not be created. Please try again later.' }); }
}
