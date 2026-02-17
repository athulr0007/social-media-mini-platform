import express from "express";
import {
  getDashboard,
  banUser,
  unbanUser,
  deletePost,
  listUsers,
  getUser,
  suspendUser,
  unsuspendUser,
  softDeleteUser,
  listPosts,
  hidePost,
  unhidePost,
  getLogs
} from "../controllers/adminController.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/dashboard", admin, getDashboard);

// Users
router.get("/users", admin, listUsers);
router.get("/users/:id", admin, getUser);
router.post("/users/:id/suspend", admin, suspendUser);
router.post("/users/:id/unsuspend", admin, unsuspendUser);
router.post("/users/:id/soft-delete", admin, softDeleteUser);
router.post("/users/:id/ban", admin, banUser);
router.post("/users/:id/unban", admin, unbanUser);

// Posts
router.get("/posts", admin, listPosts);
router.post("/posts/:id/hide", admin, hidePost);
router.post("/posts/:id/unhide", admin, unhidePost);
router.delete("/posts/:id/permanent", admin, deletePost);

// Logs
router.get("/logs", admin, getLogs);

export default router;
