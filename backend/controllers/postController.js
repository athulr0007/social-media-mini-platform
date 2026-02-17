import Post from "../models/Post.js";
import User from "../models/User.js";
import createActivity from "../utils/createActivity.js";

/* ARCHIVE / UNARCHIVE POST */
export const toggleArchive = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    post.archived = !post.archived;
    await post.save();
    

  res.json({
      archived: post.archived,
      message: post.archived
        ? "Post archived successfully"
        : "Post unarchived successfully"
    });
    } catch (err) {
    res.status(500).json({ message: "Failed to toggle archive" });
  }
};





/* CREATE POST */
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim() && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    const images = req.files
      ? req.files.map((f) => `/uploads/${f.filename}`)
      : [];

    const post = await Post.create({
      user: req.user._id,
      content: content || "",
      images
    });

    await post.populate("user", "name email avatar");

    res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: "Failed to create post", error: err.message });
  }
};

/* GET FEED - ONLY FOLLOWING USERS POSTS (EXCLUDE ARCHIVED) */
export const getFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    
    const posts = await Post.find({
      user: { $in: [...currentUser.following, req.user._id] },
      archived: false
    })
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to load feed" });
  }
};

/* GET EXPLORE - ALL POSTS (EXCLUDE ARCHIVED) */
export const getExplorePosts = async (req, res) => {
  try {
    const posts = await Post.find({ archived: false })
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to load explore posts" });
  }
};

/* GET ALL POSTS - LEGACY */
export const getPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(posts);
};

/* LIKE / UNLIKE */
export const toggleLike = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const liked = post.likes.includes(req.user._id);

  if (liked) post.likes.pull(req.user._id);
  else post.likes.push(req.user._id);

  await post.save();

  if (!liked) {
    await createActivity({
      owner: post.user,
      actor: req.user._id,
      type: "like",
      post: post._id
    });
  }

  res.json(post.likes);
};

/* ADD COMMENT */
export const addComment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.comments.push({
    user: req.user._id,
    text: req.body.text
  });

  await post.save();
  await post.populate("comments.user", "name email");

  await createActivity({
    owner: post.user,
    actor: req.user._id,
    type: "comment",
    post: post._id
  });

  res.json(post.comments);
};

/* GET COMMENTS */
export const getComments = async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "comments.user",
    "name email"
  );

  if (!post) return res.status(404).json({ message: "Post not found" });

  res.json(post.comments);
};

/* DELETE POST */
export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await post.deleteOne();
  res.json({ success: true });
};

/* GET POSTS BY USER ID (EXCLUDE ARCHIVED) */
export const getPostsByUser = async (req, res) => {
  const posts = await Post.find({ 
    user: req.params.id,
    archived: false 
  })
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 });

  res.json(posts);
};
