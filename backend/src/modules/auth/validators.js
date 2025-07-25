import { body } from "express-validator";

export const signupValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("f_name").optional().isString().withMessage("First name must be a string"),
  body("l_name").optional().isString().withMessage("Last name must be a string"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const sendOTPValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
];

export const verifyOTPValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("otp").isLength({ min: 4, max: 6 }).withMessage("OTP must be between 4 and 6 digits")
    .matches(/^\d+$/).withMessage("OTP must be numeric"),
];
