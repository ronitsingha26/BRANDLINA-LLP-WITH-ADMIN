import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
  updateEmployeeStatus,
} from "../controllers/employeeController.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAdminAuth, getEmployees);
router.get("/:id", requireAdminAuth, getEmployeeById);
router.post("/", requireAdminAuth, createEmployee);
router.put("/:id", requireAdminAuth, updateEmployee);
router.patch("/:id/status", requireAdminAuth, updateEmployeeStatus);
router.delete("/:id", requireAdminAuth, deleteEmployee);

export default router;
