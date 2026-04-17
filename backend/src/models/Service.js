import mongoose from "mongoose";
import slugify from "slugify";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: { type: String, trim: true, default: "General" },
    excerpt: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    features: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

serviceSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
