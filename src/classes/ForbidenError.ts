import { StatusCodes } from "http-status-codes"
import { AppError } from "./AppError"

export class ForbidenError extends AppError {
  constructor() {
    super({
      message: "You are not allowed to access this resource",
      httpStatusCode: StatusCodes.UNAUTHORIZED,
    })
  }
}
