import { Request, Response, NextFunction } from "express"
import { ForbidenError } from "../classes/ForbidenError"
import { UnauthorizedError } from "../classes/UnauthorizedError"
import { Transaction } from "../models/Transaction.model"

const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.session.passport?.user
    if (userId) {
      const queryResult = await new Transaction().getAllTransactionsFromUser(
        userId.toString()
      )

      return res.json(queryResult.rows)
    }

    throw new UnauthorizedError()
  } catch (error) {
    next(error)
  }
}

const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.session.passport?.user

    if (userId) {
      const { id } = req.params
      const queryResult = await new Transaction().getById(id)
      const transaction = queryResult.rows[0]
      if (userId !== transaction.user_id) {
        throw new ForbidenError(id)
      }

      return res.json(transaction)
    }

    throw new UnauthorizedError()
  } catch (error) {
    next(error)
  }
}

const updateTransactionById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {}

const deleteTransactionById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {}

export {
  getTransactions,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
}
