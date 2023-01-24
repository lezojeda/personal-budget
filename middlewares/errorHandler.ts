import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../classes/AppError"

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.isOperational) {
    res.status(err.httpStatusCode ?? 500).json({ message: err.message })
  } else {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" })
  }
}

export { errorHandler }
