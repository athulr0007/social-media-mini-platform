import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import createActivity from "../utils/createActivity.js";

/* CREATE / GET CONVERSATION */
export const createConversation = async (req, res) => {
  const targetId = req.params.id;

  const me = await User.findById(req.user._id);
  const target = await User.findById(targetId);

  const mutual =
    me.following.includes(targetId) &&
    me.followers.includes(targetId);

  if (!mutual) {
    return res.status(403).json({ message: "Mutual follow required" });
  }

  let convo = await Conversation.findOne({
    members: { $all: [req.user._id, targetId] }
  });

  if (!convo) {
    convo = await Conversation.create({
      members: [req.user._id, targetId]
    });
  }

  res.json(convo);
};

/* SEND MESSAGE (REST persistence) */
export const sendMessage = async (req, res) => {
  const { conversationId, text } = req.body;

  const msg = await Message.create({
    conversation: conversationId,
    sender: req.user._id,
    text
  });

  res.status(201).json(msg);
};

/* GET MESSAGES */
export const getMessages = async (req, res) => {
  const messages = await Message.find({
    conversation: req.params.id
  }).sort({ createdAt: 1 });

  res.json(messages);
};

/* MARK SEEN */
export const markSeen = async (req, res) => {
  const { messageIds } = req.body;

  await Message.updateMany(
    { _id: { $in: messageIds } },
    { seen: true }
  );

  res.json({ success: true });
};




const convo = await Conversation.findById(conversationId);

const receiver = convo.members.find(
  (m) => m.toString() !== req.user._id.toString()
);

await createActivity({
  owner: receiver,
  actor: req.user._id,
  type: "message",
  conversation: conversationId,
  message: msg._id
});
