import { Request, Response, NextFunction } from "express"
import pool from "../config/db"

const createEnvelope = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const { username, password } = req.body

    const insertUserText =
      "INSERT INTO envelopes(username, hash) VALUES($1, $2) RETURNING id"
    const insertUserValues = [username]
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

export { createEnvelope }
