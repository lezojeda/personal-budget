import axios from "axios"
import express, { NextFunction, Request, Response } from "express"
import { body } from "express-validator"
import passport from "passport"
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

/**
 * The front-end application sends a request to the back-end application, which initiates the GitHub OAuth flow by redirecting
 * the user to the GitHub authorization URL.
 * This URL includes the application's client ID and a redirect URL that points back to the back-end application.
 * */
authRouter.get(
  "/github",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.get(
        "https://github.com/login/oauth/authorize",
        {
          params: {
            client_id: process.env.GITHUB_CLIENT_ID,
            redirect_uri: "http://localhost:3000/auth/github/callback",
            state: req.query.state,
          },
        }
      )

      res.json(response.request.res.responseUrl)
    } catch (error) {
      next(error)
    }
  }
)

// The back-end application exchanges the authorization code for an access token by making a POST request to the GitHub token URL.
authRouter.get(
  "/github/callback",
  passport.authenticate("github"),
  (req: Request, res: Response) => {
    // Finally, redirect the user back to the front-end application, passing any necessary data as query parameters in the URL
    const redirectUrl = "http://localhost:5173"
    res.redirect(redirectUrl)
  }
)

authRouter.get("/check", (req, res) => {
  res.json()
})

export { authRouter }
