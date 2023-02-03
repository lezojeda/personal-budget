import dotenv from "dotenv"
dotenv.config()

import express from "express"

import cors from "cors"
import morgan from "morgan"
import bodyParser from "body-parser"
import session from "express-session"
import passport from "passport"
import {
  deserializeUserCallback,
  localStrategy,
  serializeUserCallback,
} from "./src/config/passport"
import PGSimple from "connect-pg-simple"
import { serve, setup } from 'swagger-ui-express'
import { errorHandler, isAuthenticated } from "./src/middlewares"

import { authRouter, envelopesRouter, usersRouter } from "./src/routes"

import docs from './docs/docs.json'

const app = express()

// Middlewares
app.use(cors())
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 6,
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: "none",
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET ?? "",
    store:
      process.env.NODE_ENV === "development"
        ? new (PGSimple(session))()
        : new (PGSimple(session))(),
  })
)
app.use('/docs', serve, setup(docs))

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

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
