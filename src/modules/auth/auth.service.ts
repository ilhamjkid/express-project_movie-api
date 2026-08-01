import type { PrismaClient } from "#prisma/client";
import type { RegisterInput } from "#modules/auth/auth.dto";
import type { Hash } from "#utils/hash.util";
import { AppError } from "#errors/app.error";

export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private hash: Hash,
  ) {}

  public register = async (registerInput: RegisterInput) => {
    const userExists = await this.prisma.user.findUnique({
      where: { email: registerInput.email },
    });

    if (userExists) {
      const errors = {
        formErrors: [],
        fieldErrors: { email: "Email address has been used." },
      };
      throw new AppError("Registration Failed.", 400, errors);
    }

    const hashedPassword = await this.hash.hashPassword(registerInput.password);
    const { id, name, email } = await this.prisma.user.create({
      data: {
        name: registerInput.name,
        email: registerInput.email,
        password: hashedPassword,
      },
    });

    return { id, name, email };
  };
}
