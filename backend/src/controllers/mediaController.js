import Media from "../models/Media.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadImageBuffer } from "../utils/cloudinaryUpload.js";
import { recordActivity } from "../utils/recordActivity.js";

export const getMedia = asyncHandler(async (req, res) => {
  const items = await Media.find().sort({ createdAt: -1 });
  res.json(items);
});

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file?.buffer) {
    res.status(400).json({ message: "Image file is required" });
    return;
  }

  const upload = await uploadImageBuffer({
    buffer: req.file.buffer,
    folder: "brandlina/media",
    mimeType: req.file.mimetype,
    originalName: req.file.originalname,
  });

  const item = await Media.create({
    url: upload.secure_url,
    publicId: upload.public_id,
    folder: upload.folder,
    width: upload.width,
    height: upload.height,
    mimeType: req.file.mimetype,
  });

  await recordActivity({
    action: "create",
    module: "media",
    message: "Uploaded new media asset",
    resourceId: item._id.toString(),
  });

  res.status(201).json(item);
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const item = await Media.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Media not found" });
    return;
  }

  await deleteFromCloudinary(item.publicId);
  await Media.deleteOne({ _id: item._id });

  await recordActivity({
    action: "delete",
    module: "media",
    message: "Deleted media asset",
    resourceId: item._id.toString(),
  });

  res.json({ message: "Media deleted" });
});
