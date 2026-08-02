import type { NextFunction, Request, Response } from "express";
import { AppError } from "#errors/app.error";

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl} - Route not found`, 404));
};

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
      errors: err.errors ?? null,
    });
  }

  if (
    err instanceof SyntaxError &&
    "statusCode" in err &&
    err.statusCode === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload. Please check your request body syntax.",
      data: null,
      errors: null,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Token has expired.",
      data: null,
      errors: null,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid or tampered token.",
      data: null,
      errors: null,
    });
  }

  console.error("[APPLICATION] Unhandled Error:\n", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error.",
    data: null,
    errors: null,
  });
};
