import Activity from "../models/Activity.js";

export const getRecentActivities = async (req, res) => {
  const activities = await Activity.find({ owner: req.user._id })
    .populate("actor", "name avatar username")
    .populate("post", "content images")
    .sort({ createdAt: -1 })
    .limit(30);

  res.json(activities);
};

export const markActivitiesRead = async (req, res) => {
  await Activity.updateMany(
    { owner: req.user._id, read: false },
    { read: true }
  );
  res.json({ success: true });
};
