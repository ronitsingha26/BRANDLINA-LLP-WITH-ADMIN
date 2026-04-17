import Service from "../models/Service.js";
import mongoose from "mongoose";
import { deleteFromCloudinary, uploadImageBuffer } from "../utils/cloudinaryUpload.js";
import { parseArrayField } from "../utils/parseArrayField.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../utils/recordActivity.js";

function mapService(service) {
  return {
    _id: service._id,
    id: service.slug || service._id.toString(),
    title: service.title,
    slug: service.slug,
    category: service.category,
    excerpt: service.excerpt,
    description: service.description,
    image: service.image,
    features: service.features,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
}

export const getServices = asyncHandler(async (req, res) => {
  const items = await Service.find().sort({ createdAt: -1 });
  res.json(items.map(mapService));
});

export const getService = asyncHandler(async (req, res) => {
  const lookup = req.params.id;
  const filter = mongoose.Types.ObjectId.isValid(lookup)
    ? { $or: [{ _id: lookup }, { slug: lookup }] }
    : { slug: lookup };

  const item = await Service.findOne(filter);

  if (!item) {
    res.status(404).json({ message: "Service not found" });
    return;
  }

  res.json(mapService(item));
});

export const createService = asyncHandler(async (req, res) => {
  const features = parseArrayField(req.body.features);

  const payload = {
    title: req.body.title,
    category: req.body.category,
    excerpt: req.body.excerpt,
    description: req.body.description,
    features,
  };

  if (!payload.title || !payload.description) {
    res.status(400).json({ message: "Title and description are required" });
    return;
  }

  if (req.file?.buffer) {
    const upload = await uploadImageBuffer({
      buffer: req.file.buffer,
      folder: "brandlina/services",
      mimeType: req.file.mimetype,
      originalName: req.file.originalname,
    });
    payload.image = upload.secure_url;
    payload.imagePublicId = upload.public_id;
  }

  const item = await Service.create(payload);

  await recordActivity({
    action: "create",
    module: "services",
    message: `Created service: ${item.title}`,
    resourceId: item._id.toString(),
  });

  res.status(201).json(mapService(item));
});

export const updateService = asyncHandler(async (req, res) => {
  const item = await Service.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Service not found" });
    return;
  }

  const features = req.body.features !== undefined ? parseArrayField(req.body.features) : item.features;

  item.title = req.body.title ?? item.title;
  item.category = req.body.category ?? item.category;
  item.excerpt = req.body.excerpt ?? item.excerpt;
  item.description = req.body.description ?? item.description;
  item.features = features;

  if (req.file?.buffer) {
    if (item.imagePublicId) {
      await deleteFromCloudinary(item.imagePublicId);
    }

    const upload = await uploadImageBuffer({
      buffer: req.file.buffer,
      folder: "brandlina/services",
      mimeType: req.file.mimetype,
      originalName: req.file.originalname,
    });
    item.image = upload.secure_url;
    item.imagePublicId = upload.public_id;
  }

  await item.save();

  await recordActivity({
    action: "update",
    module: "services",
    message: `Updated service: ${item.title}`,
    resourceId: item._id.toString(),
  });

  res.json(mapService(item));
});

export const deleteService = asyncHandler(async (req, res) => {
  const item = await Service.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Service not found" });
    return;
  }

  if (item.imagePublicId) {
    await deleteFromCloudinary(item.imagePublicId);
  }

  await Service.deleteOne({ _id: item._id });

  await recordActivity({
    action: "delete",
    module: "services",
    message: `Deleted service: ${item.title}`,
    resourceId: item._id.toString(),
  });

  res.json({ message: "Service deleted" });
});
