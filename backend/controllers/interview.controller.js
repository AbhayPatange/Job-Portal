import mongoose from 'mongoose';
import { Job } from '../models/job.model.js';
import { reserveInterviewUsage } from '../models/aiUsage.model.js';
import { fitEnabled, generateInterviewPrep, redactContactDetails } from '../utils/jobFit.js';

export async function generateInterviewPrepForJob(req, res) {
    res.set('Cache-Control', 'no-store');
    if (!fitEnabled()) return res.status(503).json({ success: false, message: 'AI interview prep is not available yet.' });
    if (req.role !== 'student') return res.status(403).json({ success: false, message: 'Interview prep is available to candidate accounts.' });
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Choose a valid job first.' });
    try {
        const job = await Job.findById(req.params.id).lean();
        if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
        if (!await reserveInterviewUsage(req.id)) return res.status(429).json({ success: false, message: 'Your daily interview-prep limit has been reached. Please try again tomorrow (UTC).' });
        const jobText = redactContactDetails(`Title: ${job.title}\nDescription: ${job.description}\nRequirements: ${(job.requirements || []).join('; ')}\nExperience: ${job.experienceLevel} years`).slice(0, 12000);
        return res.json({ success: true, prep: await generateInterviewPrep(jobText), jobId: String(job._id) });
    } catch (error) {
        console.error('AI interview prep failed:', error.message, error.providerStatus ? `(provider status ${error.providerStatus})` : '');
        return res.status(error.providerStatus === 429 ? 429 : 502).json({ success: false, message: error.providerStatus === 429 ? 'The AI service is busy. Please try again shortly.' : 'Interview prep could not be created. Please try again later.' });
    }
}
