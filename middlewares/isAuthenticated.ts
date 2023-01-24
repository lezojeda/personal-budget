import { NextFunction, Request, Response } from "express"

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
    res.status(403).json({ message: "You're not authorized" })
  }
}
