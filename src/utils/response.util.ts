import type { Response } from "express";

export function sendResponse<T>(res: Response, statusCode: number, message: string, data?: T) {
  res.status(statusCode).json({
    success: statusCode >= 200 && statusCode <= 300,
    message,
    data: data ?? null,
  });
}
