import { Router } from "express";
import { applyLeave, getLeaveRequests, getMyLeaves, reviewLeaveRequest } from "../controllers/leaveController.js";
import { requireAdminAuth, requireEmployeeAuth } from "../middleware/auth.js";

const router = Router();

router.post("/apply", requireEmployeeAuth, applyLeave);
router.get("/my", requireEmployeeAuth, getMyLeaves);

router.get("/", requireAdminAuth, getLeaveRequests);
router.patch("/:id/review", requireAdminAuth, reviewLeaveRequest);

export default router;
