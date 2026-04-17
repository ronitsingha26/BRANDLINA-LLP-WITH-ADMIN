import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, trim: true, default: "" },
    content: { type: String, default: "" },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    author: { type: String, trim: true, default: "Brandlina Editorial" },
    tags: [{ type: String, trim: true }],
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

blogSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
