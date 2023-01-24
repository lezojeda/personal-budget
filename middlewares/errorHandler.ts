import { Request, Response, NextFunction } from "express"

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
) => {
  res.status(500).json({ message: err.message, name: err.name, stack: err.stack })
}

export { errorHandler }
