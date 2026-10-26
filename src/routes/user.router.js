import express from "express";
import { userController } from "../controllers/user.controller.js";
import { verifyMiddleware, authorizedMiddleware  } from '../middlewares/auth.middleware.js';
  
const router = express.Router();
router.get("/", verifyMiddleware, authorizedMiddleware(23), userController.getAllUsers);
router.get("/:id", verifyMiddleware, authorizedMiddleware(24), userController.getUserById);
router.post("/", verifyMiddleware, authorizedMiddleware(25), userController.createUser);
router.put("/:id", verifyMiddleware, authorizedMiddleware(26), userController.updateUser);
router.delete("/:id", verifyMiddleware, authorizedMiddleware(28), userController.deleteUser);
router.get("/:id/role", verifyMiddleware, authorizedMiddleware(29), userController.getUserRole);
export const userRouter = router; 


