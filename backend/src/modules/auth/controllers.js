import {
  //sendOTPService,
    //verifyOTPService,
  signupService,
  loginService,
  refreshTokenService,
  logoutService,
  getUserProfileService,
  resetPasswordService,
  updatePasswordService,
    updateUserProfileService,
} from "./services.js";

// Signup
export const signupController = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, addressLine1, /*{addressLine2}{,}*/ city, state, zipCode } = req.body;
    const { user } = await signupService({ firstName, lastName, email, password, phone, addressLine1, /*{addressLine2}{,}*/ city, state, zipCode });
    return res.status(201).json({ success: true, message: "User created", user });
  } catch (err) {
    return res
        .status(err.statusCode || 400)
        .json({ success: false, message: err.message });
  }
};

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
    
    const { user, userProfile } = await getUserProfileService({ accessToken });

    //Testing logs
    //console.log("user", user);
    //console.log("userProfile", userProfile);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        phone: userProfile.phone,
        addressLine1: userProfile.addressLine1,
        //addressLine2: userProfile.addressLine2,
        city: userProfile.city,
        state: userProfile.state,
        zipCode: userProfile.zipCode,
        emailVerified: user.email_confirmed_at ? true : false,
      },
    });
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json({ success: false, message: err.message });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const { test } = await resetPasswordService(email);
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updatePasswordController = async (req, res) => {
  try {
    const { password } = req.body;
    const { test } = await updatePasswordService(password);
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

//Update Profile
export const updateUserProfileController = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, addressLine1, /*{addressLine2}{,}*/ city, state, zipCode } = req.body;
        const accessToken = req.headers.authorization?.split("Bearer ")[1];
        if (!accessToken) throw new Error("Missing token");

        const  { userProfile}  = await updateUserProfileService({ accessToken, firstName, lastName, email, phone, addressLine1, /*{addressLine2}{,}*/ city, state, zipCode });

        return res.status(201).json({ success: true, message: "User Data Updated", userProfile });
    } catch (err) {
        return res
            .status(err.statusCode || 400)
            .json({ success: false, message: err.message });
    }
};
