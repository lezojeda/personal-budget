import dotenv from "dotenv"
dotenv.config()

import express from "express"

import cors from "cors"
import morgan from "morgan"
import bodyParser from "body-parser"
import session, { MemoryStore } from "express-session"
import passport from "passport"
import {
  deserializeUserCallback,
  localStrategy,
  serializeUserCallback,
} from "./src/config/passport"
import PGSimple from "connect-pg-simple"
import { serve, setup } from "swagger-ui-express"
import { errorHandler, isAuthenticated } from "./src/middlewares"

import {
  authRouter,
  envelopesRouter,
  transactionsRouter,
  usersRouter,
} from "./src/routes"

import docs from "./docs/docs.json"
import { getPool } from "./src/db"

const createApp = () => {
  const isTesting =process.env.NODE_ENV === "test"
  const app = express()

  // Middlewares
  app.use(cors())
  app.use(
    morgan("dev", { skip: () => isTesting })
  )
  app.use(bodyParser.json())
  app.use("/docs", serve, setup(docs))

  // Session middleware
  const store =
    isTesting
      ? new MemoryStore()
      : new (PGSimple(session))({ pool: getPool() })

  const cookie = {
    maxAge: 1000 * 60 * 60 * 6,
    secure:
      process.env.NODE_ENV === "development" || isTesting
        ? false
        : true,
    sameSite: "none" as const,
  }

  app.use(
    session({
      cookie: cookie,
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET ?? "",
      store,
    })
  )

  // Passport
  app.use(passport.initialize())
  app.use(passport.session())

  passport.serializeUser(serializeUserCallback)
  passport.deserializeUser(deserializeUserCallback)
  passport.use(localStrategy)

  app.use("*", isAuthenticated)

  app.use("/auth", authRouter)
  app.use("/envelopes", envelopesRouter)
  app.use("/users", usersRouter)
  app.use("/transactions", transactionsRouter)

  app.use(errorHandler)

  return app
}

export default createApp
