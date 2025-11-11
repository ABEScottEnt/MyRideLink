import { createClient } from "@supabase/supabase-js";
import AppError from "../../utils/appError.js";
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. Signup with email & password
export const signupService = async ({ profilePic, firstName, lastName, email, password, phone, addressLine1, /*{addressLine2}{,}*/ city, state, zipCode }) => {
  const { data : authData, error : authError } = await supabase
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

  if (authError) throw new AppError(authError.message, 400);
  const user = authData.user;

  // Insert into profiles
  const { data : profileData, error: profileError } = await supabase
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

  if(profilePic){
      const {data: profilePicData, error: profilePicError} = await supabase
          .storage
          .from("profilePicBucket")
          .upload(`images/${user.id}/profilePic`, profilePic, {
              cacheControl: '3600',
              upsert: false,
          })
      if (profilePicError) {
          console.error("Profile Pic insert error:", profileError);
          throw new AppError(profilePicError.message, 400);
      }
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

// 6. Update user profile
export const updateUserProfileService = async ({ accessToken, firstName, lastName, email, phone, addressLine1, /*{addressLine2}{,}*/ city, state, zipCode }) => {
    const { data: authData , error: authError } = await supabase
        .auth
        .getUser(accessToken);

    if (authError) throw new AppError("Invalid token", 401);

    const userId = authData.user.id;

    const { data: profileData, error: profileError} = await supabase
        .from("profiles")
        .update({firstName, lastName, email, phone, addressLine1, /*{addressLine2}{,}*/ city, state, zipCode})
        .eq("id", userId)
        .select()
        .single();

    if (profileError) {
        console.error("Profile Update error:", profileError);
        throw new AppError("Could not Update profile", 400);
    }

    //Testing logs
    //console.log("authData", authData);
    //console.log("profileData", profileData);

    return {
        userProfile: profileData,
    };
};

//7.Upload/Update Profile picture
export const updateProfilePicService = async({ accessToken, profilePic }) => {
    const { data: authData , error: authError } = await supabase
        .auth
        .getUser(accessToken);

    if (authError) throw new AppError("Invalid token", 401);

    const userId = authData.user.id;

    const {data: profilePicData, error: profilePicError} = await supabase
        .storage
        .from("profilePicBucket")
        .upload(`images/${userId}/profilePic`, profilePic, {
            cacheControl: '3600',
            upsert: true,
        })
    if (profilePicError) {
        console.error("Profile Pic insert error:", profilePicData);
        throw new AppError(profilePicError.message, 400);
    }

    return{
        data : profilePicData
    }
}