import type { NextFunction, Request, Response } from "express";
import type { PrismaClient, UserRole } from "#prisma/client";
import type { JwtUtil } from "#utils/jwt.util";
import { AppError } from "#errors/app.error";

export function authenticate(prisma: PrismaClient, jwtUtil: JwtUtil) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Unauthorized. Token is missing or invalid.", 401);
      }

      const accessToken = `${authHeader.split(" ")[1]}`;
      const decodedPayload = jwtUtil.verifyToken<{
        userId: string;
        role: UserRole;
      }>(accessToken, "accessToken");

      const userExists = await prisma.user.findUnique({
        where: { id: decodedPayload.userId },
      });
      if (!userExists) throw new AppError("Unauthorized. User no longer exists.", 401);

      req.user = {
        userId: userExists.id,
        name: userExists.name,
        email: userExists.email,
        role: userExists.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}
