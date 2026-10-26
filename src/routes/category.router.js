import express from "express";
import { categoryController } from "../controllers/category.controller.js";
import { verifyMiddleware, authorizedMiddleware  } from '../middlewares/auth.middleware.js';
  
const router = express.Router();
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", verifyMiddleware, authorizedMiddleware(6), categoryController.createCategory);
router.put("/:id", verifyMiddleware, authorizedMiddleware(7), categoryController.updateCategory);
router.delete("/:id", verifyMiddleware, authorizedMiddleware(8), categoryController.deleteCategory);
export const categoryRouter = router; 