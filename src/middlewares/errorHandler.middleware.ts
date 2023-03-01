import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../classes/AppError"
import { MESSAGES } from "../constants/messages"

const errorHandler = (
  err: AppError | AppError[],
  req: Request,
  res: Response
) => {
  const response: { errors: { message: string }[] } = {
    errors: [],
  }

  if (err instanceof Array) {
    err.forEach((err) => response.errors.push({ message: err.message }))
    res.status(StatusCodes.BAD_REQUEST).json(response)
  } else {
    if (err instanceof SyntaxError) {
      response.errors.push({ message: MESSAGES.VALIDATION.INCLUDE_VALID_BODY })
      res.status(err.httpStatusCode ?? 500).json(response)
    } else if (err.isOperational) {
      response.errors.push({ message: err.message })
      res.status(err.httpStatusCode ?? 500).json(response)
    } else {
      console.error(err.stack)
      response.errors.push({ message: "Internal server error" })
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
    }
  }
}

export { errorHandler }
