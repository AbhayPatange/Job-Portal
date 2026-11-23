import mongoose from 'mongoose';
import { Job } from '../models/job.model.js';
import { User } from '../models/user.model.js';
import { reserveFitUsage } from '../models/aiUsage.model.js';
import { fitEnabled, generateFit, redactContactDetails } from '../utils/jobFit.js';

export function fitStatus(req, res) {
    res.set('Cache-Control', 'no-store');
    res.json({ available: fitEnabled(), provider: 'Groq', maxCharacters: 16000 });
}
export async function checkJobFit(req, res) {
    res.set('Cache-Control', 'no-store');
    if (!fitEnabled()) return res.status(503).json({ success: false, message: 'AI fit checking is not available yet. Please try again later.' });
    if (req.role !== 'student') return res.status(403).json({ success: false, message: 'This tool is for candidates reviewing their own resume.' });
    if (req.body.consent !== true) return res.status(400).json({ success: false, message: 'Review your resume text and consent before continuing.' });
    if (!mongoose.isValidObjectId(req.params.id) || typeof req.body.resumeText !== 'string' || req.body.resumeText.trim().length < 100 || req.body.resumeText.length > 16000) {
        return res.status(400).json({ success: false, message: 'Choose a valid job and provide 100–16,000 characters of resume text.' });
    }
    try {
        const [job, user] = await Promise.all([Job.findById(req.params.id).lean(), User.findById(req.id).select('fullname email phoneNumber').lean()]);
        if (!job || !user) return res.status(404).json({ success: false, message: 'Job or profile not found.' });
        const resume = redactContactDetails(req.body.resumeText, user);
        if (resume.length < 100) return res.status(400).json({ success: false, message: 'Please include more work experience, education, or skills.' });
        // Only job-related fields go to the provider, never candidate IDs or application data.
        const jobText = redactContactDetails(`Title: ${job.title}\nDescription: ${job.description}\nRequirements: ${(job.requirements || []).join('; ')}\nExperience: ${job.experienceLevel} years`).slice(0, 12000);
        if (!await reserveFitUsage(req.id)) return res.status(429).json({ success: false, message: 'The daily AI limit has been reached. Please try again tomorrow (UTC).' });
        const analysis = await generateFit(resume, jobText);
        return res.json({ success: true, analysis, jobId: String(job._id) });
    } catch (error) {
        // Never log resumes, prompts, provider bodies, or credentials.
        console.error('AI fit request failed:', error.message, error.providerStatus ? `(provider status ${error.providerStatus})` : '');
        if (error.providerStatus === 429) return res.status(429).json({ success: false, message: 'The AI service is busy. Please try again shortly.' });
        if (error.providerStatus === 401 || error.providerStatus === 403) return res.status(503).json({ success: false, message: 'The AI service configuration needs attention. Please try again later.' });
        return res.status(502).json({ success: false, message: 'We could not produce a reliable analysis. Please try again later.' });
    }
}
