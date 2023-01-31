import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../classes/AppError"

const errorHandler = (
  err: AppError | AppError[],
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: { errors: { message: string }[] } = {
    errors: [],
  }

  if (err instanceof Array) {
    err.forEach((err) => response.errors.push({ message: err.message }))
    res.status(StatusCodes.BAD_REQUEST).json(response)
  } else {
    if (err.isOperational) {
      response.errors.push({ message: err.message })
      res.status(err.httpStatusCode ?? 500).json(response)
    } else {
      console.error(err.stack)
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" })
    }
  }
}

export { errorHandler }
