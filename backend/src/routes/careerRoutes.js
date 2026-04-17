import { Router } from "express";
import {
  createCareerJob,
  deleteCareerApplication,
  deleteCareerJob,
  getAdminCareerJobs,
  getCareerApplications,
  getPublicCareerJobs,
  submitCareerApplication,
  updateCareerApplicationStatus,
  updateCareerJob,
} from "../controllers/careerController.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

router.get("/jobs", getPublicCareerJobs);
router.get("/jobs/admin", requireAdminAuth, getAdminCareerJobs);
router.post("/jobs", requireAdminAuth, createCareerJob);
router.put("/jobs/:id", requireAdminAuth, updateCareerJob);
router.delete("/jobs/:id", requireAdminAuth, deleteCareerJob);

router.post("/applications", submitCareerApplication);
router.get("/applications", requireAdminAuth, getCareerApplications);
router.patch("/applications/:id/status", requireAdminAuth, updateCareerApplicationStatus);
router.delete("/applications/:id", requireAdminAuth, deleteCareerApplication);

export default router;
