import express from "express";
import protect from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";

const router = express.Router();

/* GET MESSAGES */
router.get("/:conversationId", protect, async (req, res) => {
  const messages = await Message.find({
    conversation: req.params.conversationId
  }).populate("sender", "name");

  res.json(messages);
});

export default router;
