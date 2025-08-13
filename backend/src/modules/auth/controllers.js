import {
  //sendOTPService,
    //verifyOTPService,
  signupService,
  loginService,
  refreshTokenService,
  logoutService,
  getUserProfileService,
} from "./services.js";

// Signup
export const signupController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user } = await signupService({ email, password });
    return res.status(201).json({ success: true, message: "User created", user });
  } catch (err) {
    return res
        .status(err.statusCode || 400)
        .json({ success: false, message: err.message });
  }
};

// Step 1: Send OTP to email for signup
/******************************************
export const sendOTPController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await sendOTPService({ email });
    return res
      .status(200)
      .json({ success: true, message: "OTP sent", ...result });
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json({ success: false, message: err.message });
  }
};

// Step 2: Verify OTP and create user
export const verifyOTPController = async (req, res) => {
  try {
    const { email, otp, fullName, password } = req.body;
    const { token, refreshToken, user } = await verifyOTPService({
      email,
      otp,
      fullName,
      password,
    });
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.email_confirmed_at ? true : false,
      },
    });
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json({ success: false, message: err.message });
  }
};
********************************************/

// Step 3: Login with email and password
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, session } = await loginService({ email, password});

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.email_confirmed_at ? true : false,
      },
      token: session.access_token,
      refreshToken: session.refresh_token,
    });
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json({ success: false, message: err.message });
  }
};

// Step 4: Refresh token
export const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const { user, session} = await refreshTokenService({ refreshToken });

    return res.status(200).json({
      success: true,
      message: "Token refreshed",
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.email_confirmed_at ? true : false,
      },
      token: session.access_token,
      refreshToken: session.refresh_token,
    });
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json({ success: false, message: err.message });
  }
};

// Step 5: Logout
export const logoutController = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split("Bearer ")[1];
    if (!accessToken) throw new Error("Missing token");
    await logoutService({ accessToken });
    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// Step 6: Get user profile
export const getUserProfileController = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split("Bearer ")[1];
    if (!accessToken) throw new Error("Missing token");
    
    const { user } = await getUserProfileService({ accessToken });
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.email_confirmed_at ? true : false,
      },
    });
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json({ success: false, message: err.message });
  }
};
