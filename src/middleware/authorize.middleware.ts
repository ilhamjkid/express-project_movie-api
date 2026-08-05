import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "#prisma/client";
import { AppError } from "#errors/app.error";

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.role) {
      return next(new AppError("Unauthorized. User is not logged in.", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Forbidden. Access denied.", 403));
    }

    next();
  };
}
