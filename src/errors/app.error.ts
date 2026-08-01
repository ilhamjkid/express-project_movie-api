export class AppError<T = unknown> extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: T,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
