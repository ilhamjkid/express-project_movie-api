import type { Response } from "express";
import { AppError } from "#errors/app.error";

export function sendSuccessResponse<T = unknown>(
  res: Response,
  message: string,
  statusCode: number,
  data?: T,
) {
  if (statusCode < 200 || statusCode >= 300) {
    throw new AppError("Invalid Success Status Code.", 500);
  }

  res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
}
