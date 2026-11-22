import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
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

export default router;

