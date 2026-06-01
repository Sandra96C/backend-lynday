import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", authMiddleware, isAdmin, register);
router.post("/login", login);

export default router;
