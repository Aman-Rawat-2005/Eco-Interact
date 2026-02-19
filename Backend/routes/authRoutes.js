import express from "express";
import {
  syncUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers
} from "../controllers/authController.js";

import {
  validateUserData,
  requestLogger,
  checkUserExists
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply request logger to all routes (optional - for debugging)
router.use(requestLogger);

// 🔐 Sync User (Login/Register)
// Public route - validates user data before syncing
router.post("/sync-user", validateUserData, syncUser);

// 👤 Get User Profile by Firebase UID
// Protected route - checks if user exists
router.get("/user/:uid", checkUserExists, getUserProfile);

// 📝 Update User Profile
// Protected route - checks if user exists before update
router.put("/user/:uid", checkUserExists, updateUserProfile);

// 🗑️ Delete User Account
// Protected route - checks if user exists before deletion
router.delete("/user/:uid", checkUserExists, deleteUser);

// 📊 Get All Users (Admin Feature)
router.get("/users", getAllUsers);

export default router;