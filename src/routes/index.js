import express from "express";
import { productRouter } from "../routes/product.router.js";
import { categoryRouter } from "../routes/category.router.js"; 
import { userRouter } from "../routes/user.router.js"; 
import { orderRouter } from "../routes/order.router.js";
import { authRouter } from "../routes/auth.router.js";

const router = express.Router();
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/users", userRouter);
router.use("/orders", orderRouter);
router.use("/auth", authRouter);

export const mainRouter = router;

