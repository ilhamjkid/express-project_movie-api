import type { NextFunction, Request, Response } from "express";
import type { AuthService } from "#modules/auth/auth.service";
import { success, setCookie, clearCookie } from "#utils/response.util";
import { AppError } from "#errors/app.error";

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

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken;
      if (token) await this.authService.logout(token);
      clearCookie(res, "refreshToken");
      success(res, "Logout successful.", 200);
    } catch (error) {
      clearCookie(res, "refreshToken");
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken;
      if (!token) throw new AppError("Unauthorized. Refresh token missing.", 401);
      const { access, refresh } = await this.authService.refreshToken(token);
      setCookie(res, "refreshToken", refresh.token, refresh.exp);
      success(res, "Refresh token successful.", 200, { accessToken: access.token });
    } catch (error) {
      clearCookie(res, "refreshToken");
      next(error);
    }
  };

  public getMe = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError("Unauthorized. User not found.", 401));
    success(res, "Get user data successful.", 200, { user: req.user });
  };
}
