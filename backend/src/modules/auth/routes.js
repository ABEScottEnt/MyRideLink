// routes.js
import express from "express";
import { protect } from "../../middleware/auth.js";

import {
  signupController,
  loginController,
  logoutController,
  refreshTokenController,
  getUserProfileController,
  resetPasswordController,
} from "./controllers.js";

import {
  signupValidator,
  loginValidator,
  refreshTokenValidator,
  resetPasswordValidator,
} from "./validators.js";

import { validate } from "../../middleware/validation.js";

const router = express.Router();

// Toggle protection via ENV variable
const ROUTE_PROTECTION_ENABLED = process.env.ROUTE_PROTECTION_ENABLED === "true";

// Helper to conditionally apply middleware
const maybeProtect = (handler) => (ROUTE_PROTECTION_ENABLED ? [protect, handler] : [handler]);

// Public routes
router.post("/signup", signupValidator, validate, signupController);
router.post("/login", loginValidator, validate, loginController);
router.post("/reset-password", resetPasswordValidator, validate, resetPasswordController);

// Protected routes (conditionally)
router.post("/refresh-token", refreshTokenValidator, validate, ...maybeProtect(refreshTokenController));
router.post("/logout", ...maybeProtect(logoutController));
router.get("/profile", ...maybeProtect(getUserProfileController));

export default router;
