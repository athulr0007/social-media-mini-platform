import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import sendOTP from "../utils/mailer.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

const generateOtp = () =>
  otpGenerator.generate(6, {
    upperCaseAlphabets: true,
    lowerCaseAlphabets: true,
    digits: true,
    specialChars: false,
  });

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* ================= REGISTER ================= */

export const registerUser = async (req, res) => {
  try {
    let { name, username, email, password } = req.body;

    email = email.trim().toLowerCase();
    username = username.trim().toLowerCase();

    if (!validateEmail(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password too short" });

    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.status(400).json({ message: "Email already used" });

    const usernameExists = await User.findOne({ username });
    if (usernameExists)
      return res.status(400).json({ message: "Username taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    res.status(201).json({ message: "Registration successful. Please login." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



/* ================= LOGIN ================= */

export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(403).json({
        message: "Verify email first",
        requiresVerification: true,
      });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.loginOtp = hashedOtp;
    user.loginOtpExpiry = Date.now() + 10 * 60 * 1000;
    user.loginOtpAttempts = 0;
    await user.save();

    await sendOTP(email, otp);

    res.json({ message: "Login OTP sent" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VERIFY LOGIN OTP ================= */

export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.loginOtpAttempts >= 5)
      return res.status(403).json({ message: "Too many attempts" });

    if (user.loginOtpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    const match = await bcrypt.compare(otp, user.loginOtp);
    if (!match) {
      user.loginOtpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.loginOtp = null;
    user.loginOtpExpiry = null;
    user.loginOtpAttempts = 0;
    await user.save();

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,  // ADD THIS
      bio: user.bio,        // ADD THIS
      isAdmin: user.isAdmin || false,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CHECK USERNAME ================= */

export const checkUsername = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username || username.length < 3)
      return res.json({ available: false, message: "Invalid username" });

    const exists = await User.findOne({
      username: username.toLowerCase()
    });

    res.json({
      available: !exists,
      message: exists ? "Username taken" : "Username available"
    });
  } catch {
    res.status(500).json({ available: false });
  }
};

/* ================= RESEND LOGIN OTP ================= */

export const resendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.loginOtp = hashedOtp;
    user.loginOtpExpiry = Date.now() + 10 * 60 * 1000;
    user.loginOtpAttempts = 0;

    await user.save();
    await sendOTP(email, otp);

    res.json({ message: "Login OTP resent" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
