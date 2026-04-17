import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import serviceRoutes from "./routes/serviceRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import homepageRoutes from "./routes/homepageRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import erpDashboardRoutes from "./routes/erpDashboardRoutes.js";
import { createContact } from "./controllers/contactController.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { isCloudinaryReady } from "./config/cloudinary.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, "./uploads");
const legacyUploadsDir = path.resolve(__dirname, "../uploads");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, etc.)
      if (!origin) return callback(null, true);
      // Allow any localhost port in development
      if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        return callback(null, true);
      }
      // Allow configured production origin
      const allowed = process.env.CLIENT_ORIGIN;
      if (allowed && origin === allowed) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadsDir));
app.use("/uploads", express.static(legacyUploadsDir));

app.get("/health", (req, res) => {
  const cloudinaryConfigured = isCloudinaryReady();

  res.json({
    ok: true,
    service: "brandlina-cms",
    time: new Date().toISOString(),
    cloudinaryConfigured,
    uploadsMode: cloudinaryConfigured ? "cloudinary" : "local",
  });
});

app.use("/services", serviceRoutes);
app.use("/projects", projectRoutes);
app.use("/blogs", blogRoutes);
app.use("/contacts", contactRoutes);
app.post("/contact", createContact);
app.use("/media", mediaRoutes);
app.use("/homepage", homepageRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/settings", settingsRoutes);
app.use("/careers", careerRoutes);
app.use("/auth", authRoutes);
app.use("/employees", employeeRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/leaves", leaveRoutes);
app.use("/erp/dashboard", erpDashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
