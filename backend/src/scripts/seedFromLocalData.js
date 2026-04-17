import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import { connectDB } from "../config/db.js";
import { bootstrapDefaults } from "../config/bootstrap.js";
import Service from "../models/Service.js";
import Project from "../models/Project.js";
import Blog from "../models/Blog.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../..");

async function readJson(relativePath) {
  const fullPath = path.resolve(rootDir, relativePath);
  const content = await fs.readFile(fullPath, "utf-8");
  return JSON.parse(content);
}

async function run() {
  await connectDB(process.env.MONGODB_URI);
  await bootstrapDefaults();

  const [services, projects, blogs] = await Promise.all([
    readJson("src/data/services.json"),
    readJson("src/data/projects.json"),
    readJson("src/data/blog.json"),
  ]);

  await Service.deleteMany({});
  await Project.deleteMany({});
  await Blog.deleteMany({});

  await Service.insertMany(
    services.map((item) => ({
      title: item.title,
      category: item.category,
      excerpt: item.excerpt,
      description: item.description,
      image: item.image,
      features: item.features,
    })),
  );

  await Project.insertMany(
    projects.map((item) => ({
      name: item.title || item.name,
      category: item.category,
      location: item.location,
      description: item.description,
      outcome: item.outcome,
      images: item.gallery?.length ? item.gallery : item.images || [],
      date: item.date || Date.now(),
    })),
  );

  await Blog.insertMany(
    blogs.map((item) => ({
      title: item.title,
      excerpt: item.excerpt,
      content: Array.isArray(item.content) ? item.content.join("\n\n") : item.content,
      image: item.cover,
      author: item.author,
      tags: item.tags,
      publishedAt: item.publishedAt,
    })),
  );

  console.log("Seed complete");
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
