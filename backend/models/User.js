import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_.]+$/
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: false,
      default: null
    },

    avatar: {
      type: String,
      default: null
    },

    bio: {
      type: String,
      default: "",
      maxlength: 150
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    isAdmin: {
      type: Boolean,
      default: false
    },

    isBanned: {
      type: Boolean,
      default: false
    },

    isDeleted: {
      type: Boolean,
      default: false
    },
    isBot: {
  type: Boolean,
  default: false
},


    // ===== EMAIL VERIFICATION =====

    isVerified: {
      type: Boolean,
      default: false
    },

    otp: {
      type: String,
      default: null
    },

    otpExpiry: {
      type: Date,
      default: null
    },

    otpAttempts: {
      type: Number,
      default: 0
    },

    // ===== LOGIN OTP =====

    loginOtp: {
      type: String,
      default: null
    },

    loginOtpExpiry: {
      type: Date,
      default: null
    },

    loginOtpAttempts: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);
