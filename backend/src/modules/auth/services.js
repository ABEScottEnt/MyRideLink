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

//Sign In using Google

export const googleSigninService = async ({ idToken }) => {
    console.log(idToken);
    const {data, error} = await supabase
        .auth
        .signInWithIdToken(
            {
                provider:"google",
                token: idToken
            }
        )

    if (error) throw new AppError("Something wrong with the Google account", 401);

    return {
        user: data.user,
        session: data.session, // includes access_token & refresh_token
    };
}

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

// 3. Send password reset Email
export const resetPasswordEmailService = async (email) => {
    const {error} = await supabase.auth.resetPasswordForEmail(email);
    //console.log("data " + data);
    //console.log("error " + error);
    if (error) throw new AppError("Email sent Unsuccessful: " + error.message, 400);
};

// 4. Update user password
export const updatePasswordService = async (email, password) => {
    const {error } = await supabase.auth.updateUser({ password: password })
    if (error) throw new AppError("Password Update Failed: " + error.message, 400);

    // Weirdly enough an error is not thrown if not logged in
    // Fortunately, the database remains unchanged in this scenario.
    // console.log(await supabase.auth.getUser()) // Prints the logged in user for debugging purposes
    // Prints user and null error if logged in.
    // Prints profile fetch error if error. This can happen if a user logged in, then logged out.
    // Doesn't run if a person wasn't logged in after the back end starts.
    // Doesn't run if the old password matches the new password
};

// 5. Refresh token
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

// 6. Logout user
export const logoutService = async ({ accessToken }) => {
  const { error } = await supabase
      .auth
      .admin
      .signOut(accessToken);
  if (error) throw new AppError("Logout failed: " + error.message, 400);
};

// 7. Get user profile
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

// 8. Update user profile
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

//9.Upload/Update Profile picture
export const updateProfilePicService = async({ accessToken, file }) => {
    const { data: authData , error: authError } = await supabase
        .auth
        .getUser(accessToken);

    if (authError) throw new AppError("Invalid token", 401);

    const userId = authData.user.id;

    const filePath = `users/${userId}/avatar.jpg`;

    const {data: profilePicData, error: profilePicError} = await supabase
        .storage
        .from("profilePicBucket")
        .upload(filePath, file.buffer, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.mimetype,
        })

    const { data: publicUrlData, error: publicUrlError } = supabase
        .storage
        .from("profilePicBucket")
        .getPublicUrl(filePath);

    const {data: updateUrlData, error: updateUrlError} = await supabase
        .from("profiles")
        .update({ profile_pic_url: publicUrlData.publicUrl })
        .eq("id", userId);

    if (profilePicError) {
        console.error("Profile Pic insert error:", profilePicData);
        throw new AppError(profilePicError.message, 400);
    }

    if (publicUrlError){
        console.error("Public Url error:", publicUrlData);
        throw new AppError(publicUrlError.message, 400)
    };
    if (updateUrlError) {
        console.error("Public Url error:", updateUrlData);
        throw new AppError(updateUrlError.message, 400);
    }


    return{
        data : publicUrlData.publicUrl
    }
}