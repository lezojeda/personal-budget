import { StatusCodes } from "http-status-codes"
import { AppError } from "./AppError"

export class ForbidenError extends AppError {
  constructor(entityId: string) {
    super({
      message: "You are not allowed to access the resource of id " + entityId,
      httpStatusCode: StatusCodes.UNAUTHORIZED,
    })
  }
}
