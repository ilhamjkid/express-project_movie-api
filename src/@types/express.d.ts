import { AuthJwtPayload } from "#modules/auth/auth.dto";

declare global {
  namespace Express {
    interface Request {
      user?: AuthJwtPayload;
    }
  }
}
