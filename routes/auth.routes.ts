import express, { NextFunction, Request, Response } from "express"
import passport from "passport"
import { signIn, signUp } from "../controllers/auth.controller"

const authRouter = express.Router()

authRouter.post("/signin", passport.authenticate("local"), signIn)

authRouter.post("/signup", signUp)

authRouter.post(
  "/signout",
  (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
    })
    res.send(req.session)
  }
)

export { authRouter }
