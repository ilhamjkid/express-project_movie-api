import type { NextFunction, Request, Response } from "express";
import type { AuthService } from "#modules/auth/auth.service";
import { sendSuccessResponse } from "#utils/response.util";

export class AuthController {
  constructor(private authService: AuthService) {}

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      sendSuccessResponse(res, "Registration Successful.", 201, result);
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      sendSuccessResponse(res, "Login Successful.", 200, result);
    } catch (error) {
      next(error);
    }
  };
}
