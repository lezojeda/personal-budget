import express from "express"
import {
  deleteTransactionById,
  getTransactionById,
  getTransactions,
  updateTransactionById,
} from "../controllers"

const transactionsRouter = express.Router()

transactionsRouter.get("/", getTransactions)

transactionsRouter.get("/:id", getTransactionById)

transactionsRouter.patch("/:id", updateTransactionById)

transactionsRouter.delete("/:id", deleteTransactionById)

export { transactionsRouter }
