import { Router } from "express";
import { createContact, deleteContact, getContacts, updateContactStatus } from "../controllers/contactController.js";
import { requireAdminAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAdminAuth, getContacts);
router.post("/", createContact);
router.patch("/:id/status", requireAdminAuth, updateContactStatus);
router.delete("/:id", requireAdminAuth, deleteContact);

export default router;
