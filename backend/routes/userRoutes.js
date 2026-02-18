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
import User from "../models/User.js";

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


router.get("/bot", protect, async (req, res) => {
  const bot = await User.findOne({ username: "sparkbot" })
  .select("_id name username");
  res.json(bot);
});

/* OTHER USER PROFILE */
router.get("/:id", protect, getUserById);

export default router;