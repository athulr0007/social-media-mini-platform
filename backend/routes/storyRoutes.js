import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  createStory,
  getStories,
  deleteStory
} from "../controllers/storyController.js";

const router = express.Router();

router.post("/", protect, upload.single("media"), createStory);
router.get("/", protect, getStories);
router.delete("/:id", protect, deleteStory);

export default router;