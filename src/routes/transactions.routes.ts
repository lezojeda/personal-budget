import express from "express"
import { body } from 'express-validator'
import { MESSAGES } from '../constants/messages'
import {
  deleteTransactionById,
  getTransactionById,
  getTransactions,
  updateTransactionById,
} from "../controllers"

const transactionsRouter = express.Router()

transactionsRouter.get("/", getTransactions)

transactionsRouter.get("/:id", getTransactionById)

transactionsRouter.patch(
  "/:id",
  body("amount", MESSAGES.AMOUNT_REQUIRED).trim().isFloat({ min: 0 }),
  updateTransactionById
)

transactionsRouter.delete("/:id", deleteTransactionById)

export { transactionsRouter }
