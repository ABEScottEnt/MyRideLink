import { Router } from "express";
import { requireSupabaseAuth } from "../../middleware/auth/requireSupabaseAuth.js";
import { requireAdmin } from "../../middleware/auth/requireAdmin.js";
import {
  getProfile,
  updateProfile,
  deleteUser,
  getAllUsers,
  getUserById,
} from "./controllers.js";

const router = Router();

router.get("/me", requireSupabaseAuth, getProfile);
router.patch("/me", requireSupabaseAuth, updateProfile);
router.get("/:id", requireSupabaseAuth, getUserById);
router.delete("/:id", requireSupabaseAuth, requireAdmin, deleteUser);
router.get("/", requireSupabaseAuth, requireAdmin, getAllUsers);

export default router;
