import express from "express";
import {
  getCurrentUser,
  updateUserProfile
} from "../controllers/authController.js";
import { requireUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes in this file require x-firebase-uid header

// 👤 Get current user profile
router.get("/me", requireUser, getCurrentUser);

// 📝 Update user profile
router.put("/profile", requireUser, updateUserProfile);

export default router;