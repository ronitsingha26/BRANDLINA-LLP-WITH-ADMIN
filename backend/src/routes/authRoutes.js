import { Router } from "express";
import { getCurrentUser, loginAdmin, loginEmployee } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/admin/login", loginAdmin);
router.post("/employee/login", loginEmployee);
router.get("/me", requireAuth, getCurrentUser);

export default router;
