import express from "express"
import { body, param } from "express-validator"
import { MESSAGES } from "../constants/messages"
import {
  deleteTransactionById,
  getTransactionById,
  getTransactions,
  updateTransactionById,
} from "../controllers"
import { checkTransactionAccess, handleValidationResult } from "../middlewares"

const transactionsRouter = express.Router()

transactionsRouter.use(
  "/:id",
  param("id", MESSAGES.ID_MUST_BE_INT).trim().isInt(),
  handleValidationResult,
  checkTransactionAccess
)

/**
 * TODO: Add optional query param to filter by envelope
 */
transactionsRouter.get("/", getTransactions)

transactionsRouter.get("/:id", getTransactionById)

transactionsRouter.patch(
  "/:id",
  body("amount", MESSAGES.AMOUNT_REQUIRED).trim().isFloat({ min: 0 }),
  handleValidationResult,
  updateTransactionById
)

transactionsRouter.delete("/:id", deleteTransactionById)

export { transactionsRouter }
