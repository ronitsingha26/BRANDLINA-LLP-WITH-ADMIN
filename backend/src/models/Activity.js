import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    module: { type: String, required: true },
    message: { type: String, required: true },
    resourceId: { type: String, default: "" },
  },
  { timestamps: true },
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
