import prisma from "../../lib/prisma.js";
import AppError from "../../utils/appError.js";

export const getProfileService = async (userId) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      f_name: true,
      l_name: true,
      role: true,
      created_at: true,
    },
  });
  if (!user) throw new AppError("User not found", 404);
  return {
    id: user.id,
    email: user.email,
    firstName: user.f_name,
    lastName: user.l_name,
    role: user.role,
    createdAt: user.created_at,
  };
};

export const updateProfileService = async (userId, updateData) => {
  // Optional: validate updateData fields here or rely on controller validation

  const allowedFields = ["firstName", "lastName"]; // You can expand this list
  const dataToUpdate = {};

  // Map frontend field names to database field names
  if (updateData.firstName !== undefined) {
    dataToUpdate.f_name = updateData.firstName;
  }
  if (updateData.lastName !== undefined) {
    dataToUpdate.l_name = updateData.lastName;
  }

  if (Object.keys(dataToUpdate).length === 0) {
    throw new AppError("No valid fields provided for update", 400);
  }

  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: dataToUpdate,
    select: {
      id: true,
      email: true,
      f_name: true,
      l_name: true,
      role: true,
      created_at: true,
    },
  });

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    firstName: updatedUser.f_name,
    lastName: updatedUser.l_name,
    role: updatedUser.role,
    createdAt: updatedUser.created_at,
  };
};

export const getUserByIdService = async (id) => {
  const user = await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      f_name: true,
      l_name: true,
      role: true,
      created_at: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    firstName: user.f_name,
    lastName: user.l_name,
    role: user.role,
    createdAt: user.created_at,
  };
};

export const deleteUserService = async (id) => {
  const user = await prisma.users.findUnique({ where: { id } });
  if (!user) throw new AppError("User not found", 404);

  await prisma.users.delete({ where: { id } });
  return;
};

export const getAllUsersService = async () => {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      email: true,
      f_name: true,
      l_name: true,
      role: true,
      created_at: true,
    },
  });

  return users.map((user) => ({
    id: user.id,
    email: user.email,
    firstName: user.f_name,
    lastName: user.l_name,
    role: user.role,
    createdAt: user.created_at,
  }));
};
