import express from "express";
import passport from "passport";

const router = express.Router();

// Start Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  async (req, res) => {
    // User is attached to req.user by the strategy verify callback
    const user = req.user;
    // The strategy should already create/find the user. Generate token and redirect to frontend.
    const jwt = await import("jsonwebtoken");
    const token = jwt.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    // Redirect with token and minimal user info in query (frontend will store it)
    const params = new URLSearchParams({
      token,
      id: String(user._id),
      username: user.username || "",
      name: user.name || "",
      email: user.email || "",
      avatar: user.avatar || ""
    });
    res.redirect(`${frontend}/oauth-success?${params.toString()}`);
  }
);

export default router;
