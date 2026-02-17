import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:id/comment", protect, addComment);
router.get("/:id/comments", protect, getComments);

export default router;
