import { Router } from "express";
import { prisma } from "#config/db.config";
import { HashUtil } from "#utils/hash.util";
import { JwtUtil } from "#utils/jwt.util";
import { AuthService } from "#modules/auth/auth.service";
import { AuthController } from "#modules/auth/auth.controller";
import { loginSchema, registerSchema } from "#modules/auth/auth.dto";
import { validate } from "#middleware/validate.middleware";
import { authenticate } from "#middleware/auth.middleware";

const router = Router();

const hashUtil = new HashUtil();
const jwtUtil = new JwtUtil();
const authService = new AuthService(prisma, hashUtil, jwtUtil);
const authController = new AuthController(authService);

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshToken);
router.get("/me", authenticate(prisma, jwtUtil), authController.getMe);

export { router as authRouter };
