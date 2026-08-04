import type { PrismaClient, UserRole } from "#prisma/client";
import type { LoginInput, RegisterInput } from "#modules/auth/auth.dto";
import type { HashUtil } from "#utils/hash.util";
import type { JwtUtil } from "#utils/jwt.util";
import { AppError } from "#errors/app.error";

export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private hashUtil: HashUtil,
    private jwtUtil: JwtUtil,
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
      throw new AppError("Registration failed.", 400, errors);
    }

    const hashedPassword = await this.hashUtil.hashPassword(registerInput.password);

    const { id, name, email, role } = await this.prisma.user.create({
      data: {
        name: registerInput.name,
        email: registerInput.email,
        password: hashedPassword,
      },
    });

    const { access, refresh } = await this.generateAndSaveTokens(id, role);

    return { user: { id, name, email, role }, access, refresh };
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
      throw new AppError("Login failed.", 401, errors);
    }

    const isPasswordMatch = await this.hashUtil.comparePassword(
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
      throw new AppError("Login failed.", 401, errors);
    }

    const { access, refresh } = await this.generateAndSaveTokens(userExists.id, userExists.role);

    return {
      user: {
        id: userExists.id,
        name: userExists.name,
        email: userExists.email,
        role: userExists.role,
      },
      access,
      refresh,
    };
  };

  private generateAndSaveTokens = async (userId: string, role: UserRole) => {
    const payload = { userId, role };
    const access = this.jwtUtil.signToken(payload, "accessToken");
    const refresh = this.jwtUtil.signToken(payload, "refreshToken");

    await this.prisma.refreshToken.create({
      data: { userId, token: refresh.token, expiresAt: refresh.exp },
    });

    return { access, refresh };
  };
}
