import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "#utils/response.util";

export const notFoundHandler = (req: Request, res: Response) => {
  sendResponse(res, 404, `Cannot ${req.method} ${req.originalUrl} - Route not found`);
};

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  sendResponse(res, 500, err.message || "Internal Server Error");
};
