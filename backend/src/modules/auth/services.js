import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_EXPIRY = "7d";

export const signupService = async ({ email, password, f_name, l_name }) => {
  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const password_hash = await bcrypt.hash(password, 10);

  const newUser = await prisma.users.create({
    data: {
      email,
      password_hash,
      f_name,
      l_name,
    },
  });

  return {
    id: newUser.id,
    email: newUser.email,
    f_name: newUser.f_name,
    l_name: newUser.l_name,
    role: newUser.role,
  };
};

export const loginService = async ({ email, password }) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      f_name: user.f_name,
      l_name: user.l_name,
      role: user.role,
    },
  };
};

export const logoutService = async (token) => {
  // Optional: implement token blacklist
  return;
};

export const sendOTPService = async ({ email }) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) throw new Error("No user with that email");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // For demo: save OTP in-memory or implement table `user_otps`
  // You could also send the email here using a utility
  console.log(`[DEBUG] OTP for ${email}: ${otp}`);

  // Not storing OTP here, but in real apps you would
  return { email, otp };
};

export const verifyOTPService = async ({ email, otp }) => {
  // In real app, you'd verify OTP stored in DB or Redis
  console.log(`[DEBUG] Verifying OTP ${otp} for ${email}`);

  // Simulate verification success
  return { verified: true };
};
