import { StatusCodes } from "http-status-codes"
import { AppError } from "./AppError"

export class EntityNotFoundError extends AppError {
  constructor(entityName: string, id: string) {
    super({
      message: `The ${entityName} with id ${id} was not found`,
      httpStatusCode: StatusCodes.NOT_FOUND,
    })
  }
}
