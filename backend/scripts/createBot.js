import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const createBot = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const bot = await User.findOne({ username: "sparkbot" });
  if (!bot) {
    await User.create({
      name: "Spark AI",
      username: "sparkbot",
      email: "bot@spark.ai",
      password: "no-password-needed",
      isVerified: true,
      isBot: true, 
      bio: "I'm Spark AI, your friendly assistant. Ask me anything!"
    });
    console.log("Bot created!");
  } else {
    console.log("Bot already exists");
  }
  
  process.exit(0);
};

createBot();