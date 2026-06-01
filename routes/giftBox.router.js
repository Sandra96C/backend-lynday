import { Router } from "express";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";
import {
  createBox,
  deleteBox,
  getBoxById,
  getBoxes,
  updateBox,
} from "../controllers/giftBox.controller.js";

const router = Router();

router.get("/", getBoxes);
router.get("/:id", getBoxById);
router.post("/new", authMiddleware, createBox);
router.put("/:id", authMiddleware, updateBox);
router.delete("/:id", authMiddleware, isAdmin, deleteBox);

export default router;
