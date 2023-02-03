import { StatusCodes } from "http-status-codes"
import { AppError } from "./AppError"

export class EnvelopeNotFoundError extends AppError {
  constructor(id: string) {
    super({
      message: `The envelope with id ${id} was not found`,
      httpStatusCode: StatusCodes.NOT_FOUND,
    })
  }
}
