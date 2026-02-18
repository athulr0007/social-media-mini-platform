import Post from "../models/Post.js";
import User from "../models/User.js";
import createActivity from "../utils/createActivity.js";

/* GET LOGGED-IN USER POSTS (PROFILE) */
export const getMyPosts = async (req, res) => {
  const posts = await Post.find({ 
    user: req.user._id,
    archived: false 
  }).sort({ createdAt: -1 });

  res.json(posts);
};

/* GET ARCHIVED POSTS */
export const getArchivedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ 
      user: req.user._id,
      archived: true 
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to load archived posts" });
  }
};

/* UPDATE PROFILE */
export const updateProfile = async (req, res) => {
  try {
    const { name, username, bio } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    
    // Check username availability if changed
    if (username) {
      const currentUser = await User.findById(req.user._id);
      
      if (username.toLowerCase() !== currentUser.username) {
        // Validate format
        if (username.length < 3 || username.length > 30) {
          return res.status(400).json({ 
            message: "Username must be between 3 and 30 characters" 
          });
        }

        if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
          return res.status(400).json({ 
            message: "Username can only contain letters, numbers, underscores and periods" 
          });
        }

        // Check if new username is taken
        const exists = await User.findOne({ username: username.toLowerCase() });
        if (exists) {
          return res.status(400).json({ message: "Username already taken" });
        }

        updateData.username = username.toLowerCase();
      }
    }
    
    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/* FOLLOW / UNFOLLOW USER */
export const toggleFollow = async (req, res) => {
  const targetUserId = req.params.id;

  if (targetUserId === req.user._id.toString()) {
    return res.status(400).json({ message: "Cannot follow yourself" });
  }

  const me = await User.findById(req.user._id);
  const target = await User.findById(targetUserId);

  if (!me) {
    return res.status(404).json({ message: "Current user not found" });
  }

  if (!target) {
    return res.status(404).json({ message: "User not found" });
  }

  const isFollowing = me.following.includes(targetUserId);

  if (isFollowing) {
    me.following.pull(targetUserId);
    target.followers.pull(req.user._id);
  } else {
    me.following.push(targetUserId);
    target.followers.push(req.user._id);
    
    // ADD THIS
  await createActivity({
    owner: targetUserId,
    actor: req.user._id,
    type: "follow"
  });  
  }

  await me.save();
  await target.save();

  res.json({
    following: me.following,
    followers: target.followers
  });
};

/* CHECK MUTUAL FOLLOW (REQUIRED FOR MESSAGING) */
export const checkMutualFollow = async (req, res) => {
  const targetUserId = req.params.id;

  const me = await User.findById(req.user._id);
  const target = await User.findById(targetUserId);

  if (!target) {
    return res.status(404).json({ message: "User not found" });
  }

  const mutual =
    me.following.includes(targetUserId) &&
    target.followers.includes(req.user._id.toString());

  res.json({ mutual });
};

/* GET USER PROFILE BY ID (OTHER USER) */
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password");

  if (!user || user.isBot) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

/* SEARCH USERS - Include username */
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.json([]);
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ],
      _id: { $ne: req.user._id },
      isBot: false
    })
      .select("name username email avatar bio followers following")
      .limit(20);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};

/* GET SUGGESTED USERS */
export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    
    const suggestedUsers = await User.find({
      _id: { 
        $ne: req.user._id,
        $nin: currentUser.following
      },
      isBot: false
    })
      .select("name username email avatar bio followers following")
      .limit(10)
      .sort({ createdAt: -1 });

    res.json(suggestedUsers);
  } catch (err) {
    res.status(500).json({ message: "Failed to load suggestions" });
  }
};