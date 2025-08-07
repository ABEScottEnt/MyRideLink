import express from "express";
import {
  sendOTPController,
  verifyOTPController,
  loginController,
  logoutController,
  refreshTokenController,
  getUserProfileController,
} from "./controllers.js";

import {
  loginValidator,
  sendOTPValidator,
  verifyOTPValidator,
} from "./validators.js";

import { validate } from "../../middleware/validation.js";

const router = express.Router();

// Step 1: Send OTP to email for signup
router.post("/send-otp", sendOTPValidator, validate, sendOTPController);

// Step 2: Verify OTP and create user
router.post("/verify-otp", verifyOTPValidator, validate, verifyOTPController);

// Step 3: Login with email and password
router.post("/login", loginValidator, validate, loginController);

// Step 4: Refresh token
router.post("/refresh-token", refreshTokenController);

// Step 5: Logout
router.post("/logout", logoutController);

// Step 6: Get user profile
router.get("/profile", getUserProfileController);

export default router;
