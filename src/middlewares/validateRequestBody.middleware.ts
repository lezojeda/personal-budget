import { NextFunction, Request, Response } from "express"
import { validationResult } from 'express-validator'

export const validateRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.body).length === 0) {
    return next([{message: 'Include a body in the request'}])
  }
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const errArray = errors.array()

    return next(
      errArray.map((e) => {
        return { message: e.msg }
      })
    )
  }
  next()
}
