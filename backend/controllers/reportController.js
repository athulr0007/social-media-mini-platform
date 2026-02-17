import Report from "../models/Report.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Create a new report (any authenticated user)
export const createReport = async (req, res) => {
  try {
    const { type, targetId, reason, description } = req.body;
    if (!type || !targetId || !reason)
      return res.status(400).json({ message: "Missing required fields" });

    const reportData = {
      reporter: req.user._id,
      type,
      reason,
      description
    };

    if (type === "post") reportData.targetPost = targetId;
    else reportData.targetUser = targetId;

    const report = await Report.create(reportData);
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: list reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate("reporter", "name username email")
      .populate("targetUser", "name username email")
      .populate("targetPost", "content user");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: get a single report
export const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("reporter", "name username email")
      .populate("targetUser", "name username email")
      .populate("targetPost", "content user");
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: update report status and optionally perform action
import createAdminLog from "../utils/createAdminLog.js";
export const updateReport = async (req, res) => {
  try {
    const { action, note } = req.body;
    if (!action) return res.status(400).json({ message: "Action required" });
    if (!["dismiss", "banUser", "hidePost", "deletePost"].includes(action)) return res.status(400).json({ message: "Invalid action" });
    
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    if (report.status !== "open") return res.status(400).json({ message: "Report already resolved" });

    if (action === "dismiss") {
      report.status = "dismissed";
      await createAdminLog({ adminId: req.user._id, actionType: "dismiss_report", targetType: "report", targetId: report._id, metadata: { note } });
    } else if (action === "banUser") {
      const targetId = report.type === "user" ? report.targetUser : report.targetPost ? (await Post.findById(report.targetPost))?.user : null;
      if (!targetId) return res.status(400).json({ message: "Target user not found" });
      const targetUser = await User.findById(targetId);
      if (!targetUser) return res.status(404).json({ message: "User not found" });
      if (targetUser.isAdmin) return res.status(403).json({ message: "Cannot ban an admin" });
      if (targetUser.isBanned) return res.status(400).json({ message: "User already banned" });
      await User.findByIdAndUpdate(targetId, { isBanned: true });
      report.status = "actioned";
      await createAdminLog({ adminId: req.user._id, actionType: "ban_user_from_report", targetType: "user", targetId: targetId, metadata: { report: report._id } });
    } else if (action === "hidePost") {
      if (report.type !== "post" || !report.targetPost) return res.status(400).json({ message: "Target post not found" });
      const post = await Post.findById(report.targetPost);
      if (!post) return res.status(404).json({ message: "Post not found" });
      if (post.archived) return res.status(400).json({ message: "Post already hidden" });
      await Post.findByIdAndUpdate(report.targetPost, { archived: true });
      report.status = "actioned";
      await createAdminLog({ adminId: req.user._id, actionType: "hide_post_from_report", targetType: "post", targetId: report.targetPost, metadata: { report: report._id } });
    } else if (action === "deletePost") {
      if (report.type !== "post" || !report.targetPost) return res.status(400).json({ message: "Target post not found" });
      const post = await Post.findById(report.targetPost);
      if (!post) return res.status(404).json({ message: "Post not found" });
      await Post.findByIdAndDelete(report.targetPost);
      report.status = "actioned";
      await createAdminLog({ adminId: req.user._id, actionType: "delete_post_from_report", targetType: "post", targetId: report.targetPost, metadata: { report: report._id } });
    }

    if (note) report.note = note;
    await report.save();
    res.json(report);
  } catch (err) {
    console.error("Update report error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
