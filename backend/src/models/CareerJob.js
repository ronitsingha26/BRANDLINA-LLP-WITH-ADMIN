import mongoose from "mongoose";

const careerJobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    employmentType: { type: String, trim: true, default: "Full Time" },
    location: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true },
);

const CareerJob = mongoose.model("CareerJob", careerJobSchema);

export default CareerJob;
