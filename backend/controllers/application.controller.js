import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
};
export const bulkApplyJobs = async (req, res) => {
    try {
        if (req.role !== 'student') return res.status(403).json({ success: false, message: 'Only candidate accounts can submit applications.' });
        const jobIds = Array.isArray(req.body?.jobIds) ? [...new Set(req.body.jobIds)] : [];
        if (!req.body?.consent) return res.status(400).json({ success: false, message: 'Please confirm that you want to submit these applications.' });
        if (!jobIds.length || jobIds.length > 10 || jobIds.some((id) => typeof id !== 'string' || !mongoose.isValidObjectId(id))) return res.status(400).json({ success: false, message: 'Select between 1 and 10 valid jobs.' });
        const user = await User.findById(req.id).select('profile.resume').lean();
        if (!user?.profile?.resume) return res.status(400).json({ success: false, message: 'Upload a PDF resume before applying.' });
        const jobs = await Job.find({ _id: { $in: jobIds } }).select('_id').lean();
        const availableIds = jobs.map((job) => String(job._id));
        const existing = await Application.find({ applicant: req.id, job: { $in: availableIds } }).select('job').lean();
        const existingIds = new Set(existing.map((application) => String(application.job)));
        const toApply = availableIds.filter((id) => !existingIds.has(id));
        if (!toApply.length) return res.status(400).json({ success: false, message: 'You have already applied to the selected available jobs.', appliedJobIds: [] });
        const applications = await Application.insertMany(toApply.map((job) => ({ job, applicant: req.id })));
        await Job.updateMany({ _id: { $in: toApply } }, { $push: { applications: { $each: applications.map((application) => application._id) } } });
        return res.status(201).json({ success: true, message: `${applications.length} application${applications.length === 1 ? '' : 's'} submitted.`, appliedJobIds: toApply, skippedJobIds: jobIds.filter((id) => !toApply.includes(id)) });
    } catch (error) {
        if (error?.code === 11000) return res.status(409).json({ success: false, message: 'One or more selected roles were already applied to. Refresh and try again.' });
        return res.status(500).json({ success: false, message: 'Unable to submit those applications. Please try again.' });
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findOne({ _id: jobId, created_by: req.id }).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant', select: 'fullname email phoneNumber profile'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            success:true
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        if (req.role !== 'recruiter' || !await Job.exists({ _id: application.job, created_by: req.id })) return res.status(403).json({ success: false, message: 'You cannot update this application.' });
        if (typeof status !== 'string' || !['pending', 'accepted', 'rejected'].includes(status.toLowerCase())) return res.status(400).json({ success: false, message: 'Invalid application status.' });
        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
}
