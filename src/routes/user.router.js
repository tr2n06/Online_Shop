import express from "express";
import { userController } from "../controllers/user.controller.js";
import { verifyMiddleware, authorizedMiddleware  } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createUserSchema, updateUserSchema, updatePasswordSchema } from '../validations/user.validation.js';
  
const router = express.Router();
router.get("/", verifyMiddleware, authorizedMiddleware(23), userController.getAllUsers);
router.get("/:id", verifyMiddleware, authorizedMiddleware(24), userController.getUserById);
router.post("/", verifyMiddleware, authorizedMiddleware(25), validate(createUserSchema), userController.createUser);
router.put("/:id", verifyMiddleware, authorizedMiddleware(26), validate(updateUserSchema), userController.updateUser);
router.put("/:id/password", verifyMiddleware, authorizedMiddleware(27), validate(updatePasswordSchema), userController.updatePassword);
router.delete("/:id", verifyMiddleware, authorizedMiddleware(28), userController.deleteUser);
router.get("/:id/role", verifyMiddleware, authorizedMiddleware(29), userController.getUserRole);
export const userRouter = router; 


 