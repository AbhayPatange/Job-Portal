import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";
import { fitStatus, checkJobFit } from '../controllers/fit.controller.js';
import { generateInterviewPrepForJob } from '../controllers/interview.controller.js';
import { draftCoverLetter } from '../controllers/coverLetter.controller.js';
import { authRateLimit } from '../middlewares/authRateLimit.js';

const router = express.Router();
router.get('/fit-status', fitStatus);
router.post('/:id/fit', isAuthenticated, authRateLimit, checkJobFit);
router.post('/:id/interview-prep', isAuthenticated, authRateLimit, generateInterviewPrepForJob);
router.post('/:id/cover-letter', isAuthenticated, authRateLimit, draftCoverLetter);

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(getJobById);

export default router;

