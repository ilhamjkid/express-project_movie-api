import jwt from "jsonwebtoken";
import ms, { type StringValue } from "ms";
import { env } from "#config/env.config";

export class JwtUtil {
  private readonly accessToken = {
    secret: env.ACCESS_TOKEN_SECRET,
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  };
  private readonly refreshToken = {
    secret: env.REFRESH_TOKEN_SECRET,
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  };

  public signToken = <T extends object>(
    payload: T,
    type: "accessToken" | "refreshToken",
    expiresIn?: StringValue,
  ) => {
    const token = jwt.sign(payload, this[type].secret, {
      expiresIn: expiresIn ?? this[type].expiresIn,
    });
    const durationMs = ms(expiresIn ?? this[type].expiresIn);
    const exp = new Date(Date.now() + durationMs);
    return { token, exp };
  };

  public verifyToken = <T = Record<string, unknown>>(
    token: string,
    type: "accessToken" | "refreshToken",
  ): T => {
    return jwt.verify(token, this[type].secret) as T;
  };
}
