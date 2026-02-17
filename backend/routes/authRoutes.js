import express from "express";
import { registerUser, loginUser, verifyLoginOTP, checkUsername, resendLoginOTP } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-login-otp", verifyLoginOTP);
router.post("/resend-login-otp", resendLoginOTP);
router.get("/check-username/:username", checkUsername);


export default router;