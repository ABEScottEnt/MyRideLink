// authMiddleware.js
import { createClient } from "@supabase/supabase-js";
import AppError from "../utils/appError.js";
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const protect = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new AppError("Missing or invalid authorization header", 401);

    const token = authHeader.split("Bearer ")[1];

    // Validate token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) throw new AppError("Invalid or expired token", 401);

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      emailVerified: user.email_confirmed_at ? true : false,
    };

    next();
  } catch (err) {
    return res.status(err.statusCode || 401).json({
      success: false,
      message: err.message || "Not authorized",
    });
  }
};
