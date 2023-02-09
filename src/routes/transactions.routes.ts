import express from "express"
import { body } from "express-validator"
import { MESSAGES } from "../constants/messages"
import {
  deleteTransactionById,
  getTransactionById,
  getTransactions,
  updateTransactionById,
} from "../controllers"
import { checkTransactionAccess } from "../middlewares/checkTransactionAccess.middleware"

const transactionsRouter = express.Router()

transactionsRouter.get("/", getTransactions)

transactionsRouter.get("/:id", checkTransactionAccess, getTransactionById)

transactionsRouter.patch(
  "/:id",
  checkTransactionAccess,
  body("amount", MESSAGES.AMOUNT_REQUIRED).trim().isFloat({ min: 0 }),
  updateTransactionById
)

transactionsRouter.delete("/:id", checkTransactionAccess, deleteTransactionById)

export { transactionsRouter }
