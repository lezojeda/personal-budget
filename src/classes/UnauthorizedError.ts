import { StatusCodes } from "http-status-codes"
import { AppError } from "./AppError"

export class UnauthorizedError extends AppError {
  constructor() {
    super({
      message: "You are not authorized",
      httpStatusCode: StatusCodes.UNAUTHORIZED,
    })
  }
}
