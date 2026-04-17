import { Router } from "express";
import {
  checkIn,
  checkOut,
  exportAttendance,
  getAttendance,
  getMyAttendance,
} from "../controllers/attendanceController.js";
import { requireAdminAuth, requireEmployeeAuth } from "../middleware/auth.js";

const router = Router();

router.post("/check-in", requireEmployeeAuth, checkIn);
router.post("/check-out", requireEmployeeAuth, checkOut);
router.get("/my", requireEmployeeAuth, getMyAttendance);

router.get("/export", requireAdminAuth, exportAttendance);
router.get("/", requireAdminAuth, getAttendance);

export default router;
