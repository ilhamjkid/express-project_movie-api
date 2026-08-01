import { Router } from "express";
import { prisma } from "#config/db.config";
import { Hash } from "#utils/hash.util";
import { Jwt } from "#utils/jwt.util";
import { AuthService } from "#modules/auth/auth.service";
import { AuthController } from "#modules/auth/auth.controller";
import { loginSchema, registerSchema } from "#modules/auth/auth.dto";
import { validate } from "#middleware/validate.middleware";

const router = Router();

const hash = new Hash();
const jwt = new Jwt();
const authService = new AuthService(prisma, hash, jwt);
const authController = new AuthController(authService);

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

export { router as authRouter };
