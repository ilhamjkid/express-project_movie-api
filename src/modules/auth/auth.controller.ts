import type { NextFunction, Request, Response } from "express";
import type { AuthService } from "#modules/auth/auth.service";
import { sendSuccessResponse } from "#utils/response.util";

export class AuthController {
  constructor(private authService: AuthService) {}

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = await this.authService.register(req.body);
      sendSuccessResponse(res, "Registration Successful.", 201, newUser);
    } catch (error) {
      next(error);
    }
  };
}
