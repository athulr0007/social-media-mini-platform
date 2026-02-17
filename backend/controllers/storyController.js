import Story from "../models/Story.js";
import User from "../models/User.js";

/* CREATE STORY */
export const createStory = async (req, res) => {
  const { text, background } = req.body;

  if (!text?.trim() && !req.file) {
    return res.status(400).json({ message: "Story cannot be empty" });
  }

  const story = await Story.create({
    user: req.user._id,
    text: text || "",
    background: background || "#4f46e5",
    media: req.file ? `/uploads/${req.file.filename}` : null
  });

  await story.populate("user", "name email");

  res.status(201).json(story);
};

/* GET ACTIVE STORIES (24H) */
export const getStories = async (req, res) => {
  try {
    // Get current user's following list
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get stories only from users that current user is following (and own stories)
    const stories = await Story.find({
      user: { $in: [...currentUser.following, req.user._id] },
      expiresAt: { $gt: new Date() }
    })
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: "Failed to load stories" });
  }
};

/* DELETE STORY */
export const deleteStory = async (req, res) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    return res.status(404).json({ message: "Story not found" });
  }

  if (story.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await story.deleteOne();
  res.json({ success: true });
};