import express from "express";
import { userController } from "../controllers/user.controller.js";
import { authController } from "../controllers/auth.controller.js";
import { verifyMiddleware, authorizedMiddleware  } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';

const router = express.Router();
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/logout", verifyMiddleware, authController.logout)


export const authRouter = router;
 