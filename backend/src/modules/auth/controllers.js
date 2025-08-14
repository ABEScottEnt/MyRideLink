import {
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

// Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, session } = await loginService({ email, password });

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

// Refresh token
export const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const { user, session } = await refreshTokenService({ refreshToken });

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

// Logout
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

// Get user profile
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