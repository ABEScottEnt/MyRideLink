import { createClient } from "@supabase/supabase-js";
import prisma from "../../lib/prisma.js";
import AppError from "../../utils/appError.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. Send OTP to email (only .edu emails allowed)
export const sendOTPService = async ({ email }) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) throw new AppError(error.message, 400);

  return { message: "OTP sent to email" };
};

// 2. Verify OTP and return access token
export const verifyOTPService = async ({ email, otp }) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp, // Convert otp to token for Supabase API
    type: "email",
  });

  if (error) throw new AppError(error.message, 400);

  return {
    token: data.session.access_token,
    user: data.user,
  };
};

// 3. Signup the user in your own DB (store profile info, NOT password)
export const signupService = async ({ userId, email, firstName, lastName }) => {
  const existingUser = await prisma.users.findUnique({ where: { id: userId } });
  if (existingUser) throw new AppError("User already exists", 400);

  const newUser = await prisma.users.create({
    data: {
      id: userId, // Use Supabase UUID here
      email,
      f_name: firstName, // Match Prisma schema field names
      l_name: lastName,
      role: "user",
    },
  });

  return {
    id: newUser.id,
    email: newUser.email,
    firstName: newUser.f_name,
    lastName: newUser.l_name,
  };
};

// 4. Login user via Supabase Auth and return token & user info
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
    user: data.user, // user info from Supabase Auth
  };
};

// 5. Logout user by invalidating Supabase session
export const logoutService = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new AppError("Logout failed: " + error.message, 400);
};
