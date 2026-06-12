import { Router } from "express";
import { register, login, profile } from "../controllers/auth.controller.js";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", authMiddleware, isAdmin, register);
router.post("/login", login);

router.get("/profile", authMiddleware, profile);

export default router;
