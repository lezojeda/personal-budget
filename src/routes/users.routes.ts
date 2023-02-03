import express from "express"
import { body } from "express-validator"
import { updateUser } from "../controllers"
import { usersErrorHandler } from "../middlewares/usersErrorHandler.middleware"

const usersRouter = express.Router()

usersRouter.patch(
  "/",
  body("savings", "savings must be a number")
    .trim()
    .isString()
    .optional({ checkFalsy: true })
    .escape(),
  body("salary", "salary must be a number")
    .trim()
    .isFloat()
    .optional({ checkFalsy: true })
    .escape(),
  body("username", "username must be a string")
    .trim()
    .isString()
    .optional({ checkFalsy: true })
    .escape(),
  updateUser,
  usersErrorHandler
)

export { usersRouter }
