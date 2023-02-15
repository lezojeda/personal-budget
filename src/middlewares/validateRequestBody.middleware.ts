import { Request, Response, NextFunction } from "express"
import { MESSAGES } from "../constants/messages"

const validateRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.body).length === 0) {
    return next([{ message: MESSAGES.VALIDATION.INCLUDE_VALID_BODY }])
  }
  next()
}

export { validateRequestBody }
