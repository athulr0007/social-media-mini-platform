import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    actionType: { type: String, required: true },
    targetType: { type: String, enum: ["user", "post", "report"], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

adminLogSchema.index({ createdAt: -1 });

export default mongoose.model("AdminLog", adminLogSchema);
