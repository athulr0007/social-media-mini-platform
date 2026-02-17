import express from "express";
import { createReport, getReports, getReport, updateReport } from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

// Create a report (authenticated users)
router.post("/", protect, createReport);

// Admin routes
router.get("/", admin, getReports);
router.get("/:id", admin, getReport);
router.patch("/:id", admin, updateReport);

export default router;
