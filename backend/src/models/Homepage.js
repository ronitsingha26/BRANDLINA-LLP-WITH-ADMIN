import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "" },
    value: { type: Number, default: 0 },
    suffix: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const testimonialSchema = new mongoose.Schema(
  {
    quote: { type: String, trim: true, default: "" },
    author: { type: String, trim: true, default: "" },
    role: { type: String, trim: true, default: "" },
    initials: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    imagePublicId: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const homepageSchema = new mongoose.Schema(
  {
    hero: {
      brandline: { type: String, trim: true, default: "Brandlina LLP" },
      titleLineOne: { type: String, trim: true, default: "Turnkey infrastructure" },
      titleLineTwo: { type: String, trim: true, default: "solutions that" },
      titleAccent: { type: String, trim: true, default: "execute." },
      subtitle: { type: String, trim: true, default: "" },
      ctaPrimary: { type: String, trim: true, default: "Explore Services" },
      backgroundImage: { type: String, trim: true, default: "" },
      backgroundImagePublicId: { type: String, trim: true, default: "" },
    },
    about: {
      kicker: { type: String, trim: true, default: "About Brandlina" },
      heading: {
        type: String,
        trim: true,
        default: "Engineering-first teams delivering resilient systems for tomorrow.",
      },
      description: { type: String, trim: true, default: "" },
      ctaLabel: { type: String, trim: true, default: "Discover our story" },
      previewImage: { type: String, trim: true, default: "" },
      previewImagePublicId: { type: String, trim: true, default: "" },
    },
    cta: {
      bannerImage: { type: String, trim: true, default: "" },
      bannerImagePublicId: { type: String, trim: true, default: "" },
    },
    stats: [statSchema],
    testimonials: [testimonialSchema],
    marquee: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

const Homepage = mongoose.model("Homepage", homepageSchema);

export default Homepage;
