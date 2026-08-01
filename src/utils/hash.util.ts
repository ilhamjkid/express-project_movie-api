import bcrypt from "bcryptjs";

export class Hash {
  private readonly saltRounds = 10;

  public hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, this.saltRounds);
  };

  public comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
  };
}
