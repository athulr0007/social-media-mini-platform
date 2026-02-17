import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import createActivity from "../utils/createActivity.js";

export const addComment = async (req, res) => {
  const { text } = req.body;

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const comment = await Comment.create({
    post: req.params.id,
    user: req.user._id,
    text
  });

  res.status(201).json(comment);
};

export const getComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.id })
    .populate("user", "name email")
    .sort({ createdAt: 1 });

  res.json(comments);
};



await createActivity({
  owner: post.user,
  actor: req.user._id,
  type: "comment",
  post: post._id,
  comment: comment._id
});
