import type { PrismaClient } from "#prisma/client";
import type { AuthJwtPayload, LoginInput, RegisterInput } from "#modules/auth/auth.dto";
import type { Hash } from "#utils/hash.util";
import type { Jwt } from "#utils/jwt.util";
import { AppError } from "#errors/app.error";

export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private hash: Hash,
    private jwt: Jwt,
  ) {}

  public register = async (registerInput: RegisterInput) => {
    const userExists = await this.prisma.user.findUnique({
      where: { email: registerInput.email },
    });
    if (userExists) {
      const errors = {
        formErrors: [],
        fieldErrors: { email: ["Email address has been used."] },
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
    const token = this.jwt.signToken<AuthJwtPayload>({ userId: id });

    return { user: { id, name, email }, token };
  };

  public login = async (loginInput: LoginInput) => {
    const userExists = await this.prisma.user.findUnique({
      where: { email: loginInput.email },
    });
    if (!userExists) {
      const errors = {
        formErrors: [],
        fieldErrors: {
          email: ["Email or Password is incorrect."],
          password: ["Email or Password is incorrect."],
        },
      };
      throw new AppError("Login Failed.", 401, errors);
    }

    const isPasswordMatch = await this.hash.comparePassword(
      loginInput.password,
      userExists.password,
    );
    if (!isPasswordMatch) {
      const errors = {
        formErrors: [],
        fieldErrors: {
          email: ["Email or Password is incorrect."],
          password: ["Email or Password is incorrect."],
        },
      };
      throw new AppError("Login Failed.", 401, errors);
    }

    const token = this.jwt.signToken<AuthJwtPayload>({ userId: userExists.id });

    return {
      user: {
        id: userExists.id,
        name: userExists.name,
        email: userExists.email,
      },
      token,
    };
  };
}
