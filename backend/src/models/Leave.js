import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    leaveType: {
      type: String,
      enum: ["casual", "sick", "earned", "unpaid"],
      default: "casual",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminCredential",
      default: null,
    },
    reviewNote: {
      type: String,
      default: "",
      trim: true,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

leaveSchema.index({ employee: 1, startDate: -1 });

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
