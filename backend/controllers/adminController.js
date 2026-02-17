import User from "../models/User.js";
import Post from "../models/Post.js";
import Report from "../models/Report.js";
import AdminLog from "../models/AdminLog.js";
import Activity from "../models/Activity.js";
import createAdminLog from "../utils/createAdminLog.js";

export const getDashboard = async (req, res) => {
  try {
    // Aggregations
    const usersCount = await User.countDocuments({ isDeleted: false });
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = await Activity.distinct("owner", { createdAt: { $gte: sevenDaysAgo } });
    const activeUsersCount = activeUsers.length;
    const postsCount = await Post.countDocuments();
    const hiddenPosts = await Post.countDocuments({ archived: true });
    const pendingReports = await Report.countDocuments({ status: "open" });
    const recentActivity = await AdminLog.find().sort({ createdAt: -1 }).limit(20).populate("adminId", "name username");

    // Recent reports for quick view
    const recentReports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("reporter", "name username")
      .populate("targetUser", "name username")
      .populate("targetPost", "content user");

    res.json({ usersCount, activeUsersCount, postsCount, hiddenPosts, pendingReports, recentReports, recentActivity });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const banUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) return res.status(400).json({ message: "Cannot ban yourself" });
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    await createAdminLog({ adminId: req.user._id, actionType: "ban_user", targetType: "user", targetId: user._id, metadata: {} });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const unbanUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) return res.status(400).json({ message: "Cannot unban yourself" });
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    await createAdminLog({ adminId: req.user._id, actionType: "unban_user", targetType: "user", targetId: user._id, metadata: {} });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    await createAdminLog({ adminId: req.user._id, actionType: "delete_post_permanent", targetType: "post", targetId: post._id, metadata: {} });
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// List users with pagination and search
export const listUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
    const q = req.query.q || "";

    const filter = { isDeleted: false };
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ];
    }

    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("name username email isBanned isAdmin createdAt")
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);
    res.json({ users, total, page, limit });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name username email bio avatar isBanned isAdmin createdAt");
    if (!user) return res.status(404).json({ message: "User not found" });

    const postsCount = await Post.countDocuments({ user: user._id });
    const reportsCount = await Report.countDocuments({ $or: [{ targetUser: user._id }, { targetPost: { $in: (await Post.find({ user: user._id })).map(p=>p._id) } }] });
    const recentActivity = await Activity.find({ actor: user._id }).sort({ createdAt: -1 }).limit(20);

    res.json({ user, postsCount, reportsCount, recentActivity });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const suspendUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (!targetId) return res.status(400).json({ message: "User ID required" });
    if (req.user._id.toString() === targetId) return res.status(403).json({ message: "Cannot suspend yourself" });
    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isAdmin) return res.status(403).json({ message: "Cannot suspend another admin" });
    if (user.isBanned) return res.status(400).json({ message: "User already suspended" });
    const updated = await User.findByIdAndUpdate(targetId, { isBanned: true }, { new: true });
    await createAdminLog({ adminId: req.user._id, actionType: "suspend_user", targetType: "user", targetId: updated._id, metadata: { reason: "admin action" } });
    res.json(updated);
  } catch (err) {
    console.error("Suspend user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const unsuspendUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    await createAdminLog({ adminId: req.user._id, actionType: "unsuspend_user", targetType: "user", targetId: user._id, metadata: {} });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const softDeleteUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (!targetId) return res.status(400).json({ message: "User ID required" });
    if (req.user._id.toString() === targetId) return res.status(403).json({ message: "Cannot delete yourself" });
    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isAdmin) return res.status(403).json({ message: "Cannot delete an admin" });
    if (user.isDeleted) return res.status(400).json({ message: "User already deleted" });
    const updated = await User.findByIdAndUpdate(targetId, { isDeleted: true }, { new: true });
    await createAdminLog({ adminId: req.user._id, actionType: "soft_delete_user", targetType: "user", targetId: updated._id, metadata: { reason: "admin action" } });
    res.json(updated);
  } catch (err) {
    console.error("Soft delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Posts management
export const listPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "20", 10);
    const filter = {};
    if (req.query.archived === "true") filter.archived = true;
    const posts = await Post.find(filter).skip((page - 1) * limit).limit(limit).populate("user", "name username").sort({ createdAt: -1 });
    const total = await Post.countDocuments(filter);
    res.json({ posts, total, page, limit });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const hidePost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) return res.status(400).json({ message: "Post ID required" });
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.archived) return res.status(400).json({ message: "Post already hidden" });
    const updated = await Post.findByIdAndUpdate(postId, { archived: true }, { new: true });
    await createAdminLog({ adminId: req.user._id, actionType: "hide_post", targetType: "post", targetId: updated._id, metadata: {} });
    res.json(updated);
  } catch (err) {
    console.error("Hide post error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const unhidePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { archived: false }, { new: true });
    if (!post) return res.status(404).json({ message: "Post not found" });
    await createAdminLog({ adminId: req.user._id, actionType: "unhide_post", targetType: "post", targetId: post._id, metadata: {} });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "50", 10);
    const logs = await AdminLog.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate("adminId", "name username");
    const total = await AdminLog.countDocuments();
    res.json({ logs, total, page, limit });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
