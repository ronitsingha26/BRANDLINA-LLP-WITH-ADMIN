import { Router } from "express";
import { getEmployeeDashboard } from "../controllers/erpDashboardController.js";
import { requireEmployeeAuth } from "../middleware/auth.js";

const router = Router();

router.get("/employee", requireEmployeeAuth, getEmployeeDashboard);

export default router;
