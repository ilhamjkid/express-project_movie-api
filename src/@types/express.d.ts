import type { UserRole } from "#prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        name: string;
        email: string;
        role: UserRole;
      };
      validated?: any;
    }
  }
}
