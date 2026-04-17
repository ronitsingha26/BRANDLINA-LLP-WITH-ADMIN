import Project from "../models/Project.js";
import mongoose from "mongoose";
import { deleteFromCloudinary, uploadImageBuffer } from "../utils/cloudinaryUpload.js";
import { parseArrayField } from "../utils/parseArrayField.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../utils/recordActivity.js";

function mapProject(item) {
  return {
    _id: item._id,
    id: item.slug || item._id.toString(),
    name: item.name,
    title: item.name,
    slug: item.slug,
    category: item.category,
    location: item.location,
    description: item.description,
    outcome: item.outcome,
    cover: item.images?.[0] || "",
    images: item.images,
    gallery: item.images,
    date: item.date,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

async function uploadMany(files, folder) {
  const uploads = [];
  for (const file of files) {
    const uploaded = await uploadImageBuffer({
      buffer: file.buffer,
      folder,
      mimeType: file.mimetype,
      originalName: file.originalname,
    });
    uploads.push(uploaded);
  }
  return uploads;
}

export const getProjects = asyncHandler(async (req, res) => {
  const items = await Project.find().sort({ date: -1, createdAt: -1 });
  res.json(items.map(mapProject));
});

export const getProject = asyncHandler(async (req, res) => {
  const lookup = req.params.id;
  const filter = mongoose.Types.ObjectId.isValid(lookup)
    ? { $or: [{ _id: lookup }, { slug: lookup }] }
    : { slug: lookup };

  const item = await Project.findOne(filter);

  if (!item) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  res.json(mapProject(item));
});

export const createProject = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.description) {
    res.status(400).json({ message: "Name and description are required" });
    return;
  }

  const payload = {
    name: req.body.name,
    category: req.body.category,
    location: req.body.location,
    description: req.body.description,
    outcome: req.body.outcome,
    date: req.body.date || Date.now(),
    images: [],
    imagePublicIds: [],
  };

  if (req.files?.length) {
    const uploads = await uploadMany(req.files, "brandlina/projects");
    payload.images = uploads.map((u) => u.secure_url);
    payload.imagePublicIds = uploads.map((u) => u.public_id);
  }

  const item = await Project.create(payload);

  await recordActivity({
    action: "create",
    module: "projects",
    message: `Created project: ${item.name}`,
    resourceId: item._id.toString(),
  });

  res.status(201).json(mapProject(item));
});

export const updateProject = asyncHandler(async (req, res) => {
  const item = await Project.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  item.name = req.body.name ?? item.name;
  item.category = req.body.category ?? item.category;
  item.location = req.body.location ?? item.location;
  item.description = req.body.description ?? item.description;
  item.outcome = req.body.outcome ?? item.outcome;
  item.date = req.body.date ?? item.date;

  const keepImages = parseArrayField(req.body.keepImages);
  if (keepImages.length > 0) {
    item.images = item.images.filter((url) => keepImages.includes(url));
  }

  if (req.files?.length) {
    const uploads = await uploadMany(req.files, "brandlina/projects");
    item.images = [...item.images, ...uploads.map((u) => u.secure_url)];
    item.imagePublicIds = [...item.imagePublicIds, ...uploads.map((u) => u.public_id)];
  }

  await item.save();

  await recordActivity({
    action: "update",
    module: "projects",
    message: `Updated project: ${item.name}`,
    resourceId: item._id.toString(),
  });

  res.json(mapProject(item));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const item = await Project.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Project not found" });
    return;
  }

  for (const publicId of item.imagePublicIds || []) {
    await deleteFromCloudinary(publicId);
  }

  await Project.deleteOne({ _id: item._id });

  await recordActivity({
    action: "delete",
    module: "projects",
    message: `Deleted project: ${item.name}`,
    resourceId: item._id.toString(),
  });

  res.json({ message: "Project deleted" });
});
