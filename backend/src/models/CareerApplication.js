import mongoose from "mongoose";

const careerApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "CareerJob", required: true },
    jobTitle: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    experience: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "done"], default: "pending" },
    sourcePage: { type: String, trim: true, default: "careers_page" },
  },
  { timestamps: true },
);

const CareerApplication = mongoose.model("CareerApplication", careerApplicationSchema);

export default CareerApplication;
