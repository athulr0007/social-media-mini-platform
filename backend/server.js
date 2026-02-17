import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import Message from "./models/Message.js";
import { setIO } from "./utils/createActivity.js";

import mongoose from "mongoose";
import User from "./models/User.js";
import oauthRoutes from "./routes/oauthRoutes.js";

dotenv.config();
connectDB();

/* ---------------- CORS ORIGINS ---------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

/* ---------------- PASSPORT GOOGLE ---------------- */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        (process.env.BACKEND_URL || "http://localhost:5000") + "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails &&
          profile.emails[0] &&
          profile.emails[0].value &&
          profile.emails[0].value.toLowerCase();
        if (!email) return done(new Error("No email in Google profile"));

        let user = await User.findOne({ email });
        if (!user) {
          const base = email
            .split("@")[0]
            .replace(/[^a-z0-9_.]/gi, "")
            .toLowerCase();
          let username = base;
          let i = 0;
          while (await User.findOne({ username })) {
            i += 1;
            username = `${base}${i}`;
          }
          user = await User.create({
            name: profile.displayName || username,
            username,
            email,
            password: "",
            isVerified: true,
            avatar:
              profile.photos && profile.photos[0] && profile.photos[0].value
                ? profile.photos[0].value
                : null,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

/* ---------------- APP & SERVER ---------------- */
const app = express();
const server = http.createServer(app);

/* ---------------- SOCKET.IO ---------------- */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

/* ---------------- SOCKET STATE ---------------- */
const onlineUsers = new Map(); // userId -> socketId

setIO(io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  /* USER ONLINE */
  socket.on("user:online", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(userId);
    io.emit("users:online", Array.from(onlineUsers.keys()));
  });

  /* JOIN CONVERSATION ROOM */
  socket.on("join:conversation", (conversationId) => {
    socket.join(conversationId);
  });

  /* SEND MESSAGE */
  socket.on("message:send", async (data) => {
    const message = await Message.create({
      conversation: data.conversationId,
      sender: data.senderId,
      text: data.text,
      status: "sent"
    });

    io.to(data.conversationId).emit("message:new", message);
  });

  /* MESSAGE SEEN */
  socket.on("message:seen", async ({ conversationId, messageIds }) => {
    await Message.updateMany(
      { _id: { $in: messageIds } },
      { status: "seen" }
    );

    io.to(conversationId).emit("message:seen", messageIds);
  });

  /* DISCONNECT */
  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("users:online", Array.from(onlineUsers.keys()));
  });
});

/* ---------------- EXPRESS MIDDLEWARE ---------------- */
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use(passport.initialize());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/auth", oauthRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };