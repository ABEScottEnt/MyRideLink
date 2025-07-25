import {
  signupService,
  loginService,
  logoutService,
  sendOTPService,
  verifyOTPService,
} from "./services.js";

export const signupController = async (req, res) => {
  try {
    const result = await signupService(req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const result = await loginService(req.body);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
};

export const logoutController = async (req, res) => {
  try {
    await logoutService(req.headers.authorization);
    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const sendOTPController = async (req, res) => {
  try {
    const result = await sendOTPService(req.body);
    return res.status(200).json({ success: true, message: "OTP sent", data: result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const verifyOTPController = async (req, res) => {
  try {
    const result = await verifyOTPService(req.body);
    return res.status(200).json({ success: true, message: "OTP verified", data: result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
