import { createClient } from "@supabase/supabase-js";
import AppError from "../../utils/appError.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. Signup with email & password
export const signupService = async ({ email, password }) => {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // immediately confirm email
  });

  if (error) throw new AppError(error.message, 400);

  return { user: data.user };
};

// 2. Login with email & password
export const loginService = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new AppError("Invalid credentials", 401);

  return {
    user: data.user,
    session: data.session, // includes access_token & refresh_token
  };
};

// 3. Refresh token
export const refreshTokenService = async ({ refreshToken }) => {
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error) throw new AppError("Invalid refresh token", 401);

  return {
    user: data.user,
    session: data.session,
  };
};

// 4. Logout
export const logoutService = async ({ accessToken }) => {
  const { error } = await supabase.auth.admin.signOut(accessToken);
  if (error) throw new AppError("Logout failed: " + error.message, 400);
};

// 5. Get user profile
export const getUserProfileService = async ({ accessToken }) => {
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error) throw new AppError("Invalid token", 401);
  return { user };
};
