import type { NextFunction, Request, Response } from "express";
import * as z from "zod";
import { AppError } from "#errors/app.error";

export function validate(schema: z.ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req.body);
    if (!parseResult.success) {
      const errors = z.flattenError(parseResult.error);
      return next(new AppError("Validation Failed.", 400, errors));
    }
    req.body = parseResult.data;
    next();
  };
}
