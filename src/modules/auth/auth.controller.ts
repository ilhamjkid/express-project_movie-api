import type { NextFunction, Request, Response } from "express";
import type { AuthService } from "#modules/auth/auth.service";
import { success, setCookie } from "#utils/response.util";

export class AuthController {
  constructor(private authService: AuthService) {}

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, access, refresh } = await this.authService.register(req.body);
      setCookie(res, "refreshToken", refresh.token, refresh.exp);
      success(res, "Registration successful.", 201, { user, accessToken: access.token });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, access, refresh } = await this.authService.login(req.body);
      setCookie(res, "refreshToken", refresh.token, refresh.exp);
      success(res, "Login successful.", 200, { user, accessToken: access.token });
    } catch (error) {
      next(error);
    }
  };
}
