import { createClient } from "@supabase/supabase-js";
import AppError from "../../utils/appError.js";
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. Signup with email & password
export const signupService = async ({ firstName, lastName, email, password, phone, addressLine1, /*{addressLine2}{,}*/ city, state, zipCode }) => {
  const { data, error } = await supabase
      .auth
      .admin
      .createUser({
        email,
        password,
        email_confirm: true, // immediately confirm email
        user_metadata:{
          firstName,
          email_verified:true,
        }
      });

  if (error) throw new AppError(error.message, 400);
  const user = data.user;

  /****************************************************
  console.log("Supabase user:", user);
  console.log("Inserting profile with:", {
    id: user.id,
    firstName,
    lastName,
    phone,
    email: user.email,
    addressLine1,
    city,
    state,
    zipCode
  });
   ************************************************/

  // Insert into profiles
  const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user.id, // FK → auth.users.id
              firstName,
              lastName,
              phone,
              email: user.email,
              addressLine1,
              /*addressLine2,*/
              city,
              state,
              zipCode,
            }
          ]);

  if (profileError){
    console.error("Profile insert error:", profileError);
    throw new AppError(profileError.message, 400);
  }

  return { user };
};

// 2. Login with email & password
export const loginService = async ({ email, password }) => {
  const { data, error } = await supabase
      .auth
      .signInWithPassword({
        email,
        password,
      });

  if (error) throw new AppError("Invalid credentials", 401);

  return {
    user: data.user,
    session: data.session, // includes access_token & refresh_token
  };
};

/***************************************************
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
    fullName,
    password,
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
******************************************/

// 4. Refresh token
export const refreshTokenService = async ({ refreshToken }) => {
  const { data, error } = await supabase
      .auth
      .refreshSession({
        refresh_token: refreshToken,
      });

  if (error) {
    throw new AppError("Invalid refresh token", 401);
  }

  return {
    user: data.user,
    session: data.session,
  };
};

// 5. Logout user
export const logoutService = async ({ accessToken }) => {
  const { error } = await supabase
      .auth
      .admin
      .signOut(accessToken);
  if (error) throw new AppError("Logout failed: " + error.message, 400);
};

// 6. Get user profile
export const getUserProfileService = async ({ accessToken }) => {
  const { data: authData , error: authError } = await supabase
      .auth
      .getUser(accessToken);

  if (authError) throw new AppError("Invalid token", 401);

  const userId = authData.user.id;

  const { data: profileData, error: profileError} = await supabase
      .from("profiles").select("*")
      .eq("id", userId)
      .single();

  if (profileError) {
    console.error("Profile fetch error:", profileError);
    throw new AppError("Could not fetch profile", 400);
  }

  //Testing logs
  //console.log("authData", authData);
  //console.log("profileData", profileData);
  
  return {
    user: authData.user,
    userProfile: profileData,
  };
};


export const resetPasswordService = async (email) => {
  const {data, error} = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw new AppError("Password Reset Failed: " + error.message, 400);
};

export const updatePasswordService = async (password) => { // NOTE TO SELF: ADD FEEDBACK FOR VALIDATION
  // CURRENTLY IF THE PASSWORD ISN'T VALID (<6 Characters), NONE OF THIS FUNCTION GETS CALLED
  const { data, error } = await supabase.auth.updateUser({ password: password }) 
  if (error) throw new AppError("Password Reset Failed: " + error.message, 400); // Weirdly enough an error is not thrown if not logged in
  // Luckilly the database remains unchanged in this scenario.
  //console.log(supabase.auth.user)
  
  console.log("Update Password service resolved");
};