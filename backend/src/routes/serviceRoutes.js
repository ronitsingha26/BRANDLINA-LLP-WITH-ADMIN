import { Router } from "express";
import {
  createService,
  deleteService,
  getService,
  getServices,
  updateService,
} from "../controllers/serviceController.js";
import { upload } from "../config/multer.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getServices);
router.get("/:id", getService);
router.post("/", requireAdminAuth, upload.single("image"), createService);
router.put("/:id", requireAdminAuth, upload.single("image"), updateService);
router.delete("/:id", requireAdminAuth, deleteService);

export default router;
