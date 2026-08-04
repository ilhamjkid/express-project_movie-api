import type { NextFunction, Request, Response } from "express";
import { Prisma } from "#prisma/client";
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

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const target = (err.meta?.target as string[])?.join(", ") ?? "field";
        return res.status(409).json({
          success: false,
          message: `Unique constraint failed. Value for '${target}' already exists.`,
          data: null,
          errors: null,
        });
      }
      case "P2025": {
        return res.status(404).json({
          success: false,
          message: "Requested record was not found in the database.",
          data: null,
          errors: null,
        });
      }
      case "P2003": {
        return res.status(400).json({
          success: false,
          message: "Foreign key constraint failed. Related record does not exist.",
          data: null,
          errors: null,
        });
      }
      default:
        return res.status(400).json({
          success: false,
          message: `Database error occurred (${err.code}).`,
          data: null,
          errors: null,
        });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: "Invalid data payload provided to the database query.",
      data: null,
      errors: null,
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
