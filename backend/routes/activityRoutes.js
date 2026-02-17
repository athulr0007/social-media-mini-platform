import express from "express";
import { getRecentActivities, markActivitiesRead } from "../controllers/activityController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getRecentActivities);
router.post("/read", protect, markActivitiesRead);

export default router;
