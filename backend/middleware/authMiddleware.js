import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    console.error("❌ Missing Authorization header");
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  if (!auth.startsWith("Bearer ")) {
    console.error("❌ Invalid Authorization format:", auth.substring(0, 20));
    return res.status(401).json({ message: "Invalid Authorization format" });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.id };
    console.log("✅ Token verified for user:", decoded.id);
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

export default protect;
