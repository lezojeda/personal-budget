import express, { NextFunction, Request, Response } from "express"
import { body } from "express-validator"
import { MESSAGES } from "../constants/messages"
import { signIn, signUp } from "../controllers/auth.controller"
import { handleValidationResult, usersErrorHandler } from "../middlewares"

const authRouter = express.Router()

authRouter.post(
  "/signin",
  [
    body("username", MESSAGES.AUTH.USERNAME_REQUIRED)
      .trim()
      .notEmpty()
      .isString(),
    body("password", MESSAGES.AUTH.PASSWORD_REQUIRED)
      .trim()
      .notEmpty()
      .isString(),
  ],
  handleValidationResult,
  signIn
)

authRouter.post(
  "/signup",
  [
    body("username", MESSAGES.AUTH.USERNAME_REQUIRED)
      .trim()
      .notEmpty()
      .isString(),
    body("password", MESSAGES.AUTH.PASSWORD_REQUIRED)
      .trim()
      .notEmpty()
      .isString(),
  ],
  handleValidationResult,
  signUp,
  usersErrorHandler
)

authRouter.post(
  "/signout",
  (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
    })
    res.status(204).send()
  }
)

export { authRouter }
