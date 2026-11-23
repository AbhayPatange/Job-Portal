import express from "express";
import { getSavedJobs, login, logout, register, toggleSavedJob, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();
import { forgotPassword, resetPassword } from '../controllers/password.controller.js';
import { authRateLimit } from '../middlewares/authRateLimit.js';

router.post('/forgot-password', authRateLimit, forgotPassword);
router.post('/reset-password', authRateLimit, resetPassword);

router.route("/register").post(authRateLimit,singleUpload,register);
router.route("/login").post(authRateLimit, login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);
router.route("/saved-jobs").get(isAuthenticated, getSavedJobs);
router.route("/saved-jobs/:jobId").post(isAuthenticated, toggleSavedJob);

export default router;

