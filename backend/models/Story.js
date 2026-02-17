import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    text: {
      type: String,
      default: ""
    },

    media: {
      type: String,
      default: null
    },

    background: {
      type: String,
      default: "#4f46e5"
    },

    expiresAt: {
      type: Date,
      default: () => Date.now() + 24 * 60 * 60 * 1000
    }
  },
  { timestamps: true }
);

export default mongoose.model("Story", storySchema);
