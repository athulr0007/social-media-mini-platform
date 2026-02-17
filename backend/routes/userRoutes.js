import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  getMyPosts,
  getArchivedPosts,
  updateProfile,
  toggleFollow,
  checkMutualFollow,
  getUserById,
  searchUsers,
  getSuggestedUsers
} from "../controllers/userController.js";

const router = express.Router();

/* PROFILE */
router.get("/me/posts", protect, getMyPosts);
router.get("/me/archived", protect, getArchivedPosts);
router.put("/me/profile", protect, upload.single("avatar"), updateProfile);

/* SEARCH & SUGGESTIONS */
router.get("/search", protect, searchUsers);
router.get("/suggestions", protect, getSuggestedUsers);

/* FOLLOW / UNFOLLOW */
router.put("/:id/follow", protect, toggleFollow);

/* MUTUAL FOLLOW CHECK */
router.get("/:id/mutual", protect, checkMutualFollow);

/* OTHER USER PROFILE */
router.get("/:id", protect, getUserById);

export default router;