import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import passport from "passport"
import { AppError } from "../classes/AppError"
import { User } from "../models/user.model"
import { hashPassword } from "../utils/auth.utils"

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err, user: Express.User) => {
    if (err) next(err)
    if (!user) {
      const badCredentialsError = new AppError({
        message: "Bad credentials",
        httpStatusCode: StatusCodes.UNAUTHORIZED,
      })

      next(badCredentialsError)
    } else {
      req.logIn(user, (err) => {
        if (err) next(err)
        res.json({ message: "Signed in successfully" })
      })
    }
  })(req, res, next)
}

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body

    const hash = await hashPassword(password, 10)

    const queryResult = await new User().create(
      ["username", "hash"],
      [username, hash]
    )

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: queryResult.rows[0].id,
        username,
      },
    })
  } catch (error) {
    /**
     * Error 23505 corresponds to a unique constraint violation
     */
    if (error instanceof Error) {
      const isError23505 = "code" in error && error.code === "23505"
      const isUsernameConstraintKey =
        "constraint" in error && error.constraint === "users_username_key"

      if (isError23505 && isUsernameConstraintKey) {
        return next(
          new AppError({
            message: "Username already taken. Try another.",
            httpStatusCode: StatusCodes.CONFLICT,
          })
        )
      }
    }

    next(error)
  }
}

export { signIn, signUp }
