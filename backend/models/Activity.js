import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["like", "comment", "follow", "message"],
      required: true
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
