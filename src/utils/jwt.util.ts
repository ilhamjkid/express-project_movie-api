import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "#config/env.config";

export class Jwt {
  private readonly secretKey = env.JWT_SECRET_KEY || "fallback_secret_key";

  public signToken = <T extends object>(
    payload: T,
    expiresIn: SignOptions["expiresIn"] = "5m",
  ): string => {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  };

  public verifyToken = <T = Record<string, unknown>>(token: string): T => {
    return jwt.verify(token, this.secretKey) as T;
  };
}
