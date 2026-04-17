import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";
import { upload } from "../config/multer.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", requireAdminAuth, upload.array("images", 10), createProject);
router.put("/:id", requireAdminAuth, upload.array("images", 10), updateProject);
router.delete("/:id", requireAdminAuth, deleteProject);

export default router;
