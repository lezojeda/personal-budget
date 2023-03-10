import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"

export const handleValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const errArray = errors.array()

    return next(
      errArray.map((e) => {
        return { message: e.msg }
      })
    )
  }

  /**
   * No errors found
   */
  next()
}
