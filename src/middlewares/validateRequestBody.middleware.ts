import { Request, Response, NextFunction } from "express"

const validateRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Object.keys(req.body).length === 0) {
    return next([{ message: "Include a body in the request" }])
  }
  next()
}

export { validateRequestBody }
