import type { NextFunction, Request, Response } from "express";
import * as z from "zod";
import { AppError } from "#errors/app.error";

export function validate(schema: z.ZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body);
    if (parseResult.success) return next();
    next(new AppError("Validation Failed.", 400, z.flattenError(parseResult.error)));
  };
}
