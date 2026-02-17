import protect from "./authMiddleware.js";
import User from "../models/User.js";

const admin = async (req, res, next) => {
  // first ensure user is authenticated
  protect(req, res, async () => {
    try {
      const user = await User.findById(req.user._id);
      if (!user || !user.isAdmin)
        return res.status(403).json({ message: "Admin access required" });
      req.user = user;
      next();
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
};

export default admin;
