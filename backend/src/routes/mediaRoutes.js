import { Router } from "express";
import { deleteMedia, getMedia, uploadMedia } from "../controllers/mediaController.js";
import { upload } from "../config/multer.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getMedia);
router.post("/", requireAdminAuth, upload.single("image"), uploadMedia);
router.delete("/:id", requireAdminAuth, deleteMedia);

export default router;
