import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import cloudinary, { isCloudinaryReady } from "../config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, "../uploads");

function sanitizeFolder(folder) {
  const segments = String(folder || "brandlina")
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => segment.replace(/[^a-zA-Z0-9-_]/g, "-"));

  return segments.length > 0 ? segments : ["brandlina"];
}

function extensionFromMimeType(mimeType) {
  switch (String(mimeType || "").toLowerCase()) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/svg+xml":
      return ".svg";
    case "image/avif":
      return ".avif";
    case "image/bmp":
      return ".bmp";
    case "image/tiff":
      return ".tiff";
    case "image/x-icon":
      return ".ico";
    case "image/heic":
      return ".heic";
    case "image/heif":
      return ".heif";
    case "image/pjpeg":
      return ".jpeg";
    case "image/jpeg":
      return ".jpeg";
    case "image/jpg":
      return ".jpg";
    default:
      return "";
  }
}

function extensionFromOriginalName(originalName) {
  const extension = path.extname(String(originalName || "")).toLowerCase();

  if (/^\.[a-z0-9]{1,10}$/.test(extension)) {
    return extension;
  }

  return "";
}

function resolveImageExtension({ mimeType, originalName }) {
  return extensionFromOriginalName(originalName) || extensionFromMimeType(mimeType) || ".jpg";
}

function getServerBaseUrl() {
  const configured = process.env.SERVER_PUBLIC_URL;
  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  const port = process.env.PORT || "5001";
  return `http://localhost:${port}`;
}

async function uploadToLocalDisk({ buffer, folder, mimeType, originalName }) {
  const folderSegments = sanitizeFolder(folder);
  const fileExtension = resolveImageExtension({ mimeType, originalName });
  const fileName = `${Date.now()}-${randomUUID()}${fileExtension}`;
  const folderPath = path.join(uploadsRoot, ...folderSegments);

  await fs.mkdir(folderPath, { recursive: true });

  const diskPath = path.join(folderPath, fileName);
  await fs.writeFile(diskPath, buffer);

  const relativePath = path.posix.join(...folderSegments, fileName);
  const secureUrl = `${getServerBaseUrl()}/uploads/${relativePath}`;

  return {
    secure_url: secureUrl,
    public_id: `local:${relativePath}`,
    folder: folderSegments.join("/"),
    width: 0,
    height: 0,
  };
}

export async function uploadImageBuffer({
  buffer,
  folder = "brandlina",
  mimeType = "image/jpeg",
  originalName = "",
}) {
  if (isCloudinaryReady()) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "image" },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        },
      );

      stream.end(buffer);
    });
  }

  return uploadToLocalDisk({ buffer, folder, mimeType, originalName });
}

export async function deleteFromCloudinary(publicId) {
  if (!publicId) {
    return;
  }

  if (publicId.startsWith("local:")) {
    const relativePath = publicId.slice("local:".length);
    const absolutePath = path.resolve(uploadsRoot, relativePath);

    if (!absolutePath.startsWith(uploadsRoot)) {
      return;
    }

    await fs.unlink(absolutePath).catch(() => {});
    return;
  }

  if (!isCloudinaryReady()) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
}
