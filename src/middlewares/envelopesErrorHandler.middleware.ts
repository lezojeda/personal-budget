import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../classes/AppError"
import { MESSAGES } from "../constants/messages"

const envelopesErrorHandler = (
  error: AppError | AppError[],
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof Error) {
    const newAmountGreaterThanEnvelopeLimitConstraint =
      "constraint" in error &&
      error.constraint === "current_amount_within_envelope_limit"

    if (newAmountGreaterThanEnvelopeLimitConstraint) {
      return next(
        new AppError({
          message: MESSAGES.ENVELOPES.AMOUNT_GREATER_THAN_LIMIT,
          httpStatusCode: StatusCodes.BAD_REQUEST,
        })
      )
    }
  }
  next(error)
}

export { envelopesErrorHandler }
