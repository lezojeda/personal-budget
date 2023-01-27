import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes/build/cjs/status-codes"
import { AppError } from "../classes/AppError"
import { UnauthorizedError } from "../classes/UnauthorizedError"

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.isAuthenticated() ||
    req.baseUrl === "/auth/signin" ||
    req.baseUrl === "/auth/signup"
  ) {
    next()
  } else {
    next(new UnauthorizedError())
  }
}
