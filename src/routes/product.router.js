import express from "express";
import { productController } from "../controllers/product.controller.js";
import { verifyMiddleware, authorizedMiddleware  } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.get("/state/:state", productController.getProductByState);
router.post("/", verifyMiddleware, authorizedMiddleware(12), productController.createProduct);
router.put("/:id", verifyMiddleware, authorizedMiddleware(13), productController.updateProduct);
router.delete("/:id", verifyMiddleware, authorizedMiddleware(15), productController.deleteProduct);
export const productRouter = router;

 