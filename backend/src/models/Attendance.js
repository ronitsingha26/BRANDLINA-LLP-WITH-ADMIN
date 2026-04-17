import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    dayKey: {
      type: String,
      required: true,
      index: true,
    },
    checkInAt: {
      type: Date,
      required: true,
    },
    checkOutAt: {
      type: Date,
      default: null,
    },
    totalMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    source: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

attendanceSchema.index({ employee: 1, dayKey: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
