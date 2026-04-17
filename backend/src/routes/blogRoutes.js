import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  updateBlog,
} from "../controllers/blogController.js";
import { upload } from "../config/multer.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getBlogs);
router.get("/:id", getBlog);
router.post("/", requireAdminAuth, upload.single("image"), createBlog);
router.put("/:id", requireAdminAuth, upload.single("image"), updateBlog);
router.delete("/:id", requireAdminAuth, deleteBlog);

export default router;
