import dotenv from "dotenv"
dotenv.config()

import express, { NextFunction, Request, Response } from "express"

import cors from "cors"
import morgan from "morgan"
import bodyParser from "body-parser"
import session from "express-session"
import passport from "passport"
import {
  deserializeUserCallback,
  localStrategy,
  serializeUserCallback,
} from "./config/passport"
import { errorHandler, isAuthenticated } from "./middlewares"

import pool from "./config/db"
import { authRouter } from "./routes"

import PGSimple from "connect-pg-simple"

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

// Passport
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(serializeUserCallback)
passport.deserializeUser(deserializeUserCallback)
passport.use(localStrategy)

app.use("*", isAuthenticated)

app.use("/auth", authRouter)

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  pool.query("SELECT * FROM users", (err, results) => {
    if (err) {
      next(err)
    } else {
      res.json(req.user)
    }
  })
})

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
