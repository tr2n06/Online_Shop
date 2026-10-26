import express from "express";
import { orderController } from "../controllers/order.controller.js";
import { verifyMiddleware, authorizedMiddleware  } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.get("/", verifyMiddleware, authorizedMiddleware(16), orderController.getAllOrders);
router.get("/:id", verifyMiddleware, authorizedMiddleware(17), orderController.getOrderById);
router.get("/state/:state", verifyMiddleware, authorizedMiddleware(18), orderController.getOrdersByState);
router.get("/user/:userId", verifyMiddleware, authorizedMiddleware(19), orderController.getOrdesrByUserId);
router.post("/", verifyMiddleware, authorizedMiddleware(20), orderController.createOrder);
router.put("/:id", verifyMiddleware, authorizedMiddleware(21), orderController.updateOrderInformation);
router.delete("/:id", verifyMiddleware, authorizedMiddleware(22), orderController.deleteOrder);
export const orderRouter = router;


