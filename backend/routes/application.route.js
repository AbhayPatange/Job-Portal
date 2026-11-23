import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, bulkApplyJobs, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
import { authRateLimit } from "../middlewares/authRateLimit.js";
 
const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/bulk-apply").post(isAuthenticated, authRateLimit, bulkApplyJobs);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
 

export default router;

