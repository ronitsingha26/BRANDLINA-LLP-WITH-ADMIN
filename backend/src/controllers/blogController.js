import Blog from "../models/Blog.js";
import { deleteFromCloudinary, uploadImageBuffer } from "../utils/cloudinaryUpload.js";
import { parseArrayField } from "../utils/parseArrayField.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../utils/recordActivity.js";

function mapBlog(item) {
  return {
    _id: item._id,
    id: item.slug || item._id.toString(),
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    cover: item.image,
    image: item.image,
    author: item.author,
    tags: item.tags,
    publishedAt: item.publishedAt,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export const getBlogs = asyncHandler(async (req, res) => {
  const items = await Blog.find().sort({ publishedAt: -1, createdAt: -1 });
  res.json(items.map(mapBlog));
});

export const getBlog = asyncHandler(async (req, res) => {
  const item = await Blog.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] });

  if (!item) {
    res.status(404).json({ message: "Blog not found" });
    return;
  }

  res.json(mapBlog(item));
});

export const createBlog = asyncHandler(async (req, res) => {
  if (!req.body.title || !req.body.content) {
    res.status(400).json({ message: "Title and content are required" });
    return;
  }

  const payload = {
    title: req.body.title,
    excerpt: req.body.excerpt || "",
    content: req.body.content,
    author: req.body.author || "Brandlina Editorial",
    tags: parseArrayField(req.body.tags),
    publishedAt: req.body.publishedAt || Date.now(),
  };

  if (req.file?.buffer) {
    const upload = await uploadImageBuffer({
      buffer: req.file.buffer,
      folder: "brandlina/blog",
      mimeType: req.file.mimetype,
      originalName: req.file.originalname,
    });
    payload.image = upload.secure_url;
    payload.imagePublicId = upload.public_id;
  }

  const item = await Blog.create(payload);

  await recordActivity({
    action: "create",
    module: "blog",
    message: `Published blog: ${item.title}`,
    resourceId: item._id.toString(),
  });

  res.status(201).json(mapBlog(item));
});

export const updateBlog = asyncHandler(async (req, res) => {
  const item = await Blog.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Blog not found" });
    return;
  }

  item.title = req.body.title ?? item.title;
  item.excerpt = req.body.excerpt ?? item.excerpt;
  item.content = req.body.content ?? item.content;
  item.author = req.body.author ?? item.author;
  item.tags = req.body.tags !== undefined ? parseArrayField(req.body.tags) : item.tags;
  item.publishedAt = req.body.publishedAt ?? item.publishedAt;

  if (req.file?.buffer) {
    if (item.imagePublicId) {
      await deleteFromCloudinary(item.imagePublicId);
    }

    const upload = await uploadImageBuffer({
      buffer: req.file.buffer,
      folder: "brandlina/blog",
      mimeType: req.file.mimetype,
      originalName: req.file.originalname,
    });
    item.image = upload.secure_url;
    item.imagePublicId = upload.public_id;
  }

  await item.save();

  await recordActivity({
    action: "update",
    module: "blog",
    message: `Updated blog: ${item.title}`,
    resourceId: item._id.toString(),
  });

  res.json(mapBlog(item));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const item = await Blog.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Blog not found" });
    return;
  }

  if (item.imagePublicId) {
    await deleteFromCloudinary(item.imagePublicId);
  }

  await Blog.deleteOne({ _id: item._id });

  await recordActivity({
    action: "delete",
    module: "blog",
    message: `Deleted blog: ${item.title}`,
    resourceId: item._id.toString(),
  });

  res.json({ message: "Blog deleted" });
});
