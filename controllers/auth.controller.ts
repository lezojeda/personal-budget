import { NextFunction, Request, Response } from "express"
import { STATUS_CODES } from "http"
import { StatusCodes } from "http-status-codes"
import passport from "passport"
import { AppError } from "../classes/AppError"
import pool from "../config/db"
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
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const { username, password } = req.body

    const hash = await hashPassword(password, 10)

    const insertUserText =
      "INSERT INTO users(username, hash) VALUES($1, $2) RETURNING id"
    const insertUserValues = [username, hash]
    const queryResult = await client.query(insertUserText, insertUserValues)

    await client.query("COMMIT")
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: queryResult.rows[0].id,
        username,
      },
    })
  } catch (error) {
    await client.query("ROLLBACK")
    next(error)
  } finally {
    client.release()
  }
}

export { signIn, signUp }
