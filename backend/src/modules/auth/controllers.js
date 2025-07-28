import {
  sendOTPService,
  verifyOTPService,
  signupService,
  loginService,
  logoutService,
} from "./services.js";

// Step 1: Send OTP to email
export const sendOTPController = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await sendOTPService({ email });
    return res.status(200).json({ success: true, message: "OTP sent", ...result });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ success: false, message: err.message });
  }
};

// Step 2: Verify OTP and return Supabase session
export const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const { token, user } = await verifyOTPService({ email, otp });
    return res.status(200).json({ 
      success: true, 
      message: "OTP verified", 
      token,             // access token
      userId: user.id,   // Supabase UUID user ID
      email: user.email, // optionally email to confirm
    });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ success: false, message: err.message });
  }
};


// Step 3: Signup with email, password, name (email is already verified from step 2)
export const signupController = async (req, res) => {
  try {
    const { userId, email, firstName, lastName } = req.body;  // <-- expect userId here now
    const user = await signupService({ userId, email, firstName, lastName });
    return res.status(201).json({ success: true, message: "User signed up", user });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ success: false, message: err.message });
  }
};


// Step 4: Login with email and password (for returning users)
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const session = await loginService({ email, password });
    return res.status(200).json({ success: true, message: "Login successful", session });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ success: false, message: err.message });
  }
};

// Logout
export const logoutController = async (req, res) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) throw new Error("Missing token");
    await logoutService(token);
    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
