import { Router } from "express";
import { getHomepage, updateHomepage } from "../controllers/homepageController.js";
import { upload } from "../config/multer.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getHomepage);
router.put(
  "/",
  requireAdminAuth,
  upload.fields([
    { name: "heroImage",  maxCount: 1 },
    { name: "aboutImage", maxCount: 1 },
    { name: "ctaImage",   maxCount: 1 },
    // Per-testimonial portrait uploads (supports up to 20 testimonials)
    ...Array.from({ length: 20 }, (_, i) => ({ name: `testimonialImage_${i}`, maxCount: 1 })),
  ]),
  updateHomepage,
);

export default router;
