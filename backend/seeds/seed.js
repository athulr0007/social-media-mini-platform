import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    console.log("Clearing database...");
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();

    const password = await bcrypt.hash("123456", 10);

    console.log("Creating users...");
    const users = await User.insertMany([
      {
        name: "Admin",
        email: "admin@test.com",
        username: "admin",
        password,
        avatar: "/uploads/avatar_admin.jpg",
        isAdmin: true
      },
      {
        name: "Athul",
        email: "athul@test.com",
        username: "athul",
        password,
        avatar: "/uploads/avatar1.jpg"
      },
      {
        name: "Rahul",
        email: "rahul@test.com",
        username: "rahul",
        password,
        avatar: "/uploads/avatar2.jpg"
      },
      {
        name: "Anjali",
        email: "anjali@test.com",
        username: "anjali",
        password,
        avatar: "/uploads/avatar3.jpg"
      }
    ]);

    /* FOLLOW RELATIONSHIPS */

    // Athul ↔ Rahul
    users[0].following.push(users[1]._id);
    users[0].followers.push(users[1]._id);
    users[1].following.push(users[0]._id);
    users[1].followers.push(users[0]._id);

    // Anjali → Athul
    users[2].following.push(users[0]._id);
    users[0].followers.push(users[2]._id);

    await Promise.all(users.map((u) => u.save()));

    console.log("Creating posts...");
    const posts = await Post.insertMany([
      {
        user: users[0]._id,
        content: "Hello world 👋 This is my first post!",
        images: ["/uploads/post1.jpg"],
        likes: [users[1]._id, users[2]._id]
      },
      {
        user: users[1]._id,
        content: "Building a MERN social app 🚀",
        images: ["/uploads/post2.jpg"]
      },
      {
        user: users[2]._id,
        content: "Text-only posts should also work perfectly."
      },
      {
        user: users[1]._id,
        content: "Video posts test",
        images: ["/uploads/demo-video.mp4"] // your app treats media generically
      }
    ]);

    console.log("Creating comments...");
    await Comment.insertMany([
      {
        post: posts[0]._id,
        user: users[1]._id,
        text: "Nice start 🔥"
      },
      {
        post: posts[0]._id,
        user: users[2]._id,
        text: "Welcome!"
      },
      {
        post: posts[1]._id,
        user: users[0]._id,
        text: "Looks solid"
      }
    ]);

    console.log("Seed completed successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
