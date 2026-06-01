import { Router } from "express";
import {
  authMiddleware,
  isAdmin,
  optionalAuth,
} from "../middlewares/auth.middleware.js";
import {
  getOrderById,
  getOrders,
  updateOrder,
  createOrder,
} from "../controllers/order.controller.js";

const router = Router();

router.get("/", authMiddleware, getOrders);
router.get("/:id", optionalAuth, getOrderById);
router.put("/:id", optionalAuth, updateOrder);
router.post("/new", createOrder);

export default router;
