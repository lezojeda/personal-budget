import { Strategy } from "passport-local"
import { comparePasswords } from '../utils/auth.utils'
import { dbQuery } from '../db'
import { User } from '../models/user.model'

const deserializeUserCallback = async (
  id: string,
  done: (err: any, user?: false | Express.User | null | undefined) => void
) => {
  try {
    const queryResult = await User.getById(id)
    done(null, queryResult.rows[0])
  } catch (error) {
    done(error)
  }
}

const serializeUserCallback = (
  user: Express.User,
  done: (err: any, id?: unknown) => void
) => {
  done(null, user.id)
}

const localStrategy = new Strategy(async (username, password, done) => {
  try {
    const queryText = "SELECT * FROM users WHERE username = $1"
    const queryResult = await dbQuery(queryText, [username])

    const user = queryResult.rows[0]
    if (!user) return done(null, false)

    if (!(await comparePasswords(password, user.hash))) return done(null, false)

    return done(null, user)
  } catch (error) {
    return done(error)
  }
})

export { deserializeUserCallback, localStrategy, serializeUserCallback }
