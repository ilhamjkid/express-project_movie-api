import type { NextFunction, Request, Response } from "express";
import * as z from "zod";
import { AppError } from "#errors/app.error";

type RequestTarget = "body" | "params" | "query";

export function validate(schema: z.ZodType, target: RequestTarget = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parseResult = schema.safeParse(req[target]);
    if (!parseResult.success) {
      const errors = z.flattenError(parseResult.error);
      return next(new AppError("Validation failed.", 400, errors));
    }
    if (!req.validated) req.validated = {};
    req.validated[target] = parseResult.data;
    next();
  };
}
