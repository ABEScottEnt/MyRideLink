import express from "express";
import {
  sendOTPController,
  verifyOTPController,
  signupController,
  loginController,
  logoutController,
} from "./controllers.js";

import {
  signupValidator,
  loginValidator,
  sendOTPValidator,
  verifyOTPValidator,
} from "./validators.js";

import { validate } from "../../middleware/validation.js";

const router = express.Router();

// Step 1: Send OTP to email
router.post("/send-otp", sendOTPValidator, validate, sendOTPController);

// Step 2: Verify OTP code (to confirm email before signup)
router.post("/verify-otp", verifyOTPValidator, validate, verifyOTPController);

// Step 3: Signup (email already verified from OTP step)
router.post("/signup", signupValidator, validate, signupController);

// Step 4: Login (email/password)
router.post("/login", loginValidator, validate, loginController);

// Step 5: Logout (no validation needed)
router.post("/logout", logoutController);

export default router;
