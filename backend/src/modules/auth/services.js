import { createClient } from "@supabase/supabase-js";
import AppError from "../../utils/appError.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. Send OTP to email for signup
export const sendOTPService = async ({ email }) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Don't create user yet, just send OTP
    },
  });

  if (error) throw new AppError(error.message, 400);

  return { message: "OTP sent to email" };
};

// 2. Verify OTP and create user if verified
export const verifyOTPService = async ({ email, otp }) => {
  // First verify the OTP
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "email",
  });

  if (error) throw new AppError(error.message, 400);

  // If OTP is verified, create the user
  const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      email_verified: true
    }
  });

  if (signUpError) throw new AppError(signUpError.message, 400);

  // Generate a session for the new user
  const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });

  if (sessionError) throw new AppError(sessionError.message, 400);

  return {
    token: sessionData.properties.access_token,
    refreshToken: sessionData.properties.refresh_token,
    user: signUpData.user,
  };
};

// 3. Login with email and password
export const loginService = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new AppError("Invalid credentials", 401);
  }

  return {
    token: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: data.user,
  };
};

// 4. Refresh token
export const refreshTokenService = async ({ refreshToken }) => {
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error) {
    throw new AppError("Invalid refresh token", 401);
  }

  return {
    token: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: data.user,
  };
};

// 5. Logout user
export const logoutService = async ({ token }) => {
  const { error } = await supabase.auth.admin.signOut(token);
  if (error) throw new AppError("Logout failed: " + error.message, 400);
};

// 6. Get user profile
export const getUserProfileService = async ({ token }) => {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error) throw new AppError("Invalid token", 401);
  
  return { user };
};
