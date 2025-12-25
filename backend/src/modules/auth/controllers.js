import {
  //sendOTPService,
    //verifyOTPService,
  signupService,
    googleSigninService,
  loginService,
  refreshTokenService,
  logoutService,
  getUserProfileService,
  resetPasswordEmailService,
  updatePasswordService,
    updateUserProfileService,
    updateProfilePicService
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

//Google Signin
export const googleSigninController = async (req, res) => {
    try{
        const { idToken } = req.body;
        const {user, session} = await googleSigninService({ idToken });
        return res.status(201).json({
            success: true,
            message: "Sign in successful",
            user: {
                id: user.id,
                email: user.email,
                emailVerified: user.email_confirmed_at ? true : false,
            },
            token: session.access_token,
            refreshToken: session.refresh_token,
        });
    }
    catch(err){
        return res
            .status(err.statusCode || 400)
            .json({ success: false, message: err.message });
    }
}

//Login with email and password
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

export const resetPasswordEmailController = async (req, res) => {
    try {
        const { email } = req.body;
        await resetPasswordEmailService(email);
        return res.status(200).json({ success: true, message: "Email reset successfully" });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

export const updatePasswordController = async (req, res) => {
    try {
        const { email, password } = req.body;
        await updatePasswordService(email, password);
        return res.status(200).json({ success: true, message: "Password Updated" });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

// Step 5: Refresh token
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

// Step 6: Logout
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

// Step 7: Get user profile
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
        profile_pic_url: userProfile.profile_pic_url,
        emailVerified: user.email_confirmed_at ? true : false,
      },
    });
  } catch (err) {
    return res
      .status(err.statusCode || 400)
      .json({ success: false, message: err.message });
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

//Upload Profile Pic
export const uploadProfilePicController = async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split("Bearer ")[1];
        if (!accessToken) throw new Error("Missing token");

        const file = req.file; // from multer
        if (!file) throw new Error("No file uploaded");

        const data = await updateProfilePicService({accessToken, file});

        return res.json({success: true, url: data.publicUrl});

    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}