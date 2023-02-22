import dotenv from "dotenv"
dotenv.config()
import { Strategy } from "passport-local"
import passportGithub2 from "passport-github2"
import { comparePasswords } from "../utils/auth.utils"
import { User } from "../models/User.model"

const deserializeUserCallback = async (
  id: string,
  done: (err: any, user?: false | Express.User | null | undefined) => void
) => {
  try {
    const queryResult = await new User().getById(id)
    done(null, queryResult.rows[0])
  } catch (error) {
    done(error)
  }
}

const serializeUserCallback = (
  user: Express.User,
  done: (err: any, id?: unknown) => void
) => {
  // Establish a session for the user with their id
  return done(null, user.id)
}

const localStrategy = new Strategy(async (username, password, done) => {
  try {
    const user = await new User().getByUsername(username)
    if (!user) return done(null, false)

    if (!(await comparePasswords(password, user.hash))) return done(null, false)

    return done(null, user)
  } catch (error) {
    return done(error)
  }
})

const gitHubStrategy = new passportGithub2.Strategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    callbackURL: "http://localhost:3000/auth/github/callback",
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    const user = await new User().getByUsername(profile.username)

    if (user) {
      return done(null, user)
    }
    // Creates a new user record in your database based on the user's GitHub profile information
    const queryResult = await new User().create(
      ["username"],
      [profile.username]
    )

    // Send the psql created user instead of the github profile
    return done(null, queryResult.rows[0])
  }
)

export {
  deserializeUserCallback,
  localStrategy,
  serializeUserCallback,
  gitHubStrategy,
}
