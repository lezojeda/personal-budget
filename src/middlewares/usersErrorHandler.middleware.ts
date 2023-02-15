import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../classes/AppError"
import { MESSAGES } from "../constants/messages"

const usersErrorHandler = (
  error: AppError | AppError[],
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Error 23505 corresponds to a unique constraint violation
   */
  if (error instanceof Error) {
    const isError23505 = "code" in error && error.code === "23505"
    const isUsernameConstraintKey =
      "constraint" in error && error.constraint === "users_username_key"

    if (isError23505 && isUsernameConstraintKey) {
      return next(
        new AppError({
          message: MESSAGES.AUTH.USERNAME_TAKEN,
          httpStatusCode: StatusCodes.CONFLICT,
        })
      )
    }
  }
  next(error)
}

export { usersErrorHandler }
