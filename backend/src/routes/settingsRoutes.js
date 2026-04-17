import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { upload } from "../config/multer.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getSettings);
router.put("/", requireAdminAuth, upload.single("aboutMainImage"), updateSettings);

export default router;
