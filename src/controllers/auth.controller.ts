import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import passport from "passport"
import { AppError } from "../classes/AppError"
import { executeTransaction } from "../db"
import { hashPassword } from "../utils/auth.utils"

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err, user: Express.User) => {
    if (err) next(err)
    if (!user) {
      const badCredentialsError = new AppError({
        message: "Bad Credentials",
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

    const insertUserText =
      "INSERT INTO users(username, hash) VALUES($1, $2) RETURNING id"
    const insertUserValues = [username, hash]

    const queryResult = await executeTransaction(insertUserText, insertUserValues)

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: queryResult.rows[0].id,
        username,
      },
    })
  } catch (error) {
    next(error)
  }
}

export { signIn, signUp }
