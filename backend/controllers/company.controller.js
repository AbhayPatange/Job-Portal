import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        if (req.role !== 'recruiter') return res.status(403).json({ success: false, message: 'Recruiter account required.' });
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findOne({ _id: companyId, userId: req.id });
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
 
        if (!await Company.exists({ _id: req.params.id, userId: req.id })) return res.status(404).json({ success: false, message: 'Company not found.' });
        const updateData = { name, description, website, location };
        if (req.file) updateData.logo = (await cloudinary.uploader.upload(getDataUri(req.file).content)).secure_url;

        const company = await Company.findOneAndUpdate({ _id: req.params.id, userId: req.id }, updateData, { new: true, runValidators: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success:true
        })

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
    }
}
