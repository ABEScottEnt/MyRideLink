import { Router } from "express";
import {
  signupValidator,
  loginValidator,
  sendOTPValidator,
  verifyOTPValidator,
} from "./validators.js";

import {
  signupController,
  loginController,
  logoutController,
  sendOTPController,
  verifyOTPController,
} from "./controllers.js";

import { validate } from "./validation.js";
import { requireSupabaseAuth } from '../../middleware/requireSupabaseAuth.js';

const router = Router();

router.post("/signup", requireSupabaseAuth, signupValidator, validate, signupController);
router.post("/login", loginValidator, validate, loginController);
router.post("/logout", logoutController);
router.post("/sendOTP", sendOTPValidator, validate, sendOTPController);
router.post("/verifyOTP", verifyOTPValidator, validate, verifyOTPController);

export default router;
