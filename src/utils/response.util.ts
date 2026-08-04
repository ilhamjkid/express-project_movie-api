import type { Response } from "express";
import { env } from "#config/env.config";
import { AppError } from "#errors/app.error";

export function success<T = unknown>(res: Response, message: string, statusCode: number, data?: T) {
  if (statusCode < 200 || statusCode >= 300) {
    throw new AppError("Invalid success status code.", 500);
  }

  res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
}

export function setCookie(res: Response, name: string, value: string, expires: Date) {
  res.cookie(name, value, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
  });
}

export function clearCookie(res: Response, name: string) {
  res.clearCookie(name, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  });
}
