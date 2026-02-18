import express from "express";
import protect from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import { generateResponse } from "../services/geminiService.js";

const router = express.Router();

/* GET MESSAGES */
router.get("/:conversationId", protect, async (req, res) => {
  const messages = await Message.find({
    conversation: req.params.conversationId
  }).populate("sender", "name username");

  res.json(messages);
});

/* SEND MESSAGE */
router.post("/", protect, async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    // Create user message
    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text
    });

    const io = req.app.get("io");
    io.to(conversationId).emit("message:new", message);

    // Bot logic
    const conversation = await Conversation.findById(conversationId);
    const bot = await User.findOne({ username: "sparkbot" });

    if (
      bot &&
      conversation.participants.some(
        id => id.toString() === bot._id.toString()
      )
    ) {
      // Prevent bot responding to itself
      if (req.user._id.toString() === bot._id.toString()) {
        return res.status(201).json(message);
      }

      const reply = await generateResponse(text);

      const botMessage = await Message.create({
        conversation: conversationId,
        sender: bot._id,
        text: reply
      });

      setTimeout(() => {
        io.to(conversationId).emit("message:new", botMessage);
      }, 1000);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
