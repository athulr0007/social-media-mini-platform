import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  createPost,
  getPosts,
  getFeed,
  getExplorePosts,
  toggleLike,
  addComment,
  getComments,
  deletePost,
  getPostsByUser,
  toggleArchive
} from "../controllers/postController.js";

const router = express.Router();

// Updated to accept both images and videos - up to 5 files total
router.post("/", protect, upload.array("media", 5), createPost);

router.get("/feed", protect, getFeed);
router.get("/explore", protect, getExplorePosts);
router.get("/", protect, getPosts);

router.put("/:id/like", protect, toggleLike);
router.put("/:id/archive", protect, toggleArchive);

router.post("/:id/comment", protect, addComment);
router.get("/:id/comments", protect, getComments);

router.delete("/:id", protect, deletePost);

router.get("/user/:id", protect, getPostsByUser);

export default router;