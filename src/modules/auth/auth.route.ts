import { Router } from "express";
import { prisma } from "#config/db.config";
import { Hash } from "#utils/hash.util";
import { AuthService } from "#modules/auth/auth.service";
import { AuthController } from "#modules/auth/auth.controller";
import { registerSchema } from "#modules/auth/auth.dto";
import { validate } from "#middleware/validate.middleware";

const router = Router();

const hash = new Hash();
const authService = new AuthService(prisma, hash);
const authController = new AuthController(authService);

router.post("/register", validate(registerSchema), authController.register);

export { router as authRouter };
