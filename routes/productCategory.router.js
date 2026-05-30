import { Router } from "express";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware.js";
import {
  createProductCategory,
  deleteProductCategory,
  getProductCategoryById,
  getProductCategories,
  updateProductCategory,
} from "../controllers/productCategory.controller.js";

const router = Router();

router.get("/", getProductCategories);
router.get("/:id", getProductCategoryById);
router.post("/new", authMiddleware, createProductCategory);
router.put("/:id", authMiddleware, updateProductCategory);
router.delete("/:id", authMiddleware, deleteProductCategory);

export default router;
