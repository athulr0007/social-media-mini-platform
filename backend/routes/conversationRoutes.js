import express from "express";
import protect from "../middleware/authMiddleware.js";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";

const router = express.Router();

/* GET MUTUAL CONVERSATIONS */
router.get("/", protect, async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id
  }).populate("participants", "name avatar");  // ADD avatar here
  res.json(conversations);
});

/* CREATE CONVERSATION (ONLY MUTUAL FOLLOW) */
router.post("/:id", protect, async (req, res) => {
  const targetId = req.params.id;

  const me = await User.findById(req.user._id);
  const target = await User.findById(targetId);

  if (
    !me.following.includes(targetId) ||
    !target.following.includes(req.user._id)
  ) {
    return res.status(403).json({ message: "Not mutual followers" });
  }

  let convo = await Conversation.findOne({
    participants: { $all: [req.user._id, targetId] }
  });

  if (!convo) {
    convo = await Conversation.create({
      participants: [req.user._id, targetId]
    });
  }

  res.json(convo);
});

export default router;
