import type { NextFunction, Request, Response } from "express";
import type { AuthJwtPayload } from "#modules/auth/auth.dto";
import { AppError } from "#errors/app.error";
import { Jwt } from "#utils/jwt.util";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized. Token is missing or invalid.", 401);
    }

    const token = `${authHeader.split(" ")[1]}`;
    const decodedPayload = new Jwt().verifyToken<AuthJwtPayload>(token);

    req.user = decodedPayload;

    next();
  } catch (error) {
    next(error);
  }
};
