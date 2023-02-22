import { NextFunction, Request, Response } from "express"
import { UnauthorizedError } from "../classes/UnauthorizedError"

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const unrestrictedRoutes = [
    "/auth/signin",
    "/auth/signup",
    "/auth/github",
    "/auth/github/callback",
  ]
  if (req.isAuthenticated() || unrestrictedRoutes.includes(req.baseUrl)) {
    next()
  } else {
    next(new UnauthorizedError())
  }
}
