import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    folder: { type: String, default: "brandlina/media" },
    mimeType: { type: String, default: "image/jpeg" },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Media = mongoose.model("Media", mediaSchema);

export default Media;
