import {
  getUserByIdService,
  getProfileService,
  updateProfileService,
  deleteUserService,
  getAllUsersService,
} from "./services.js";

export const getProfile = async (req, res) => {
  try {
    const user = await getProfileService(req.user.id);
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await updateProfileService(req.user.id, req.body);
    return res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ success: false, message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id);
    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ success: false, message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    return res.status(200).json({ success: true, users });
  } catch (err) {
    return res.status(err.statusCode || 400).json({ success: false, message: err.message });
  }
};
