// routes.js
import express from "express";
import { protect } from "../../middleware/auth.js";

import {
  signupController,
    googleSigninController,
  loginController,
  logoutController,
  refreshTokenController,
  getUserProfileController,
  resetPasswordEmailController,
  updatePasswordController,
    updateUserProfileController,
    uploadProfilePicController
} from "./controllers.js";

import {
  signupValidator,
  loginValidator,
  refreshTokenValidator,
  resetPasswordValidator,
  updatePasswordValidator,
} from "./validators.js";

import { validate } from "../../middleware/validation.js";
import multer from "multer";

const router = express.Router();

// Toggle protection via ENV variable
const ROUTE_PROTECTION_ENABLED = process.env.ROUTE_PROTECTION_ENABLED === "true";

// Helper to conditionally apply middleware
const maybeProtect = (handler) => (ROUTE_PROTECTION_ENABLED ? [protect, handler] : [handler]);

// Public routes
router.post("/signup", signupValidator, validate, signupController);
router.post("/googleSignin", googleSigninController);
router.post("/login", loginValidator, validate, loginController);
router.post("/reset-password-email", resetPasswordValidator, validate, resetPasswordEmailController);
router.post("/update-password", updatePasswordValidator, validate, updatePasswordController);

// Protected routes (conditionally)
router.post("/refresh-token", refreshTokenValidator, validate, ...maybeProtect(refreshTokenController));
router.post("/logout", ...maybeProtect(logoutController));
router.get("/profile", ...maybeProtect(getUserProfileController));
router.patch("/update-profile", updateUserProfileController);

const upload = multer({ storage: multer.memoryStorage() });
router.post("/upload-profile-pic",protect,upload.single("image"), uploadProfilePicController );
export default router;
