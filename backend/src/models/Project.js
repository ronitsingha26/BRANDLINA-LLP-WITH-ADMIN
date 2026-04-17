import mongoose from "mongoose";
import slugify from "slugify";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: { type: String, trim: true, default: "General" },
    location: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    outcome: { type: String, trim: true, default: "" },
    images: [{ type: String, trim: true }],
    imagePublicIds: [{ type: String, trim: true }],
    date: { type: Date, default: Date.now },
    // ERP fields
    status: {
      type: String,
      enum: ["planning", "ongoing", "completed", "on-hold"],
      default: "planning",
    },
    startDate: { type: Date },
    expectedEndDate: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    budget: { type: String, trim: true, default: "" },
    clientName: { type: String, trim: true, default: "" },
    siteManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedStaff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

projectSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
