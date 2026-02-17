import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["post", "user"],
      required: true
    },
    targetPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reason: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ["open", "dismissed", "actioned"],
      default: "open"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Report", reportSchema);
