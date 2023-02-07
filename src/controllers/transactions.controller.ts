import { Request, Response, NextFunction } from "express"
import { matchedData } from "express-validator"
import { AppError } from "../classes/AppError"
import { ForbidenError } from "../classes/ForbidenError"
import { UnauthorizedError } from "../classes/UnauthorizedError"
import { Envelope } from "../models/Envelope.model"
import { Transaction } from "../models/Transaction.model"
import { checkTransactionExistsAndIsAccessible } from "../utils/transactions.utils"

const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryResult = await new Transaction().getAllTransactionsFromUser(
      req.user?.id.toString()
    )

    return res.json(queryResult.rows)

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
    const { id } = req.params
    const queryResult = await new Transaction().getById(id)
    const transaction = queryResult.rows[0]
    if (req.user?.id !== transaction.user_id) {
      throw new ForbidenError(id)
    }

    return res.json(transaction)
  } catch (error) {
    next(error)
  }
}

const updateTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bodyData = matchedData(req, { locations: ["body"] })
    if (Object.keys(bodyData).length === 0) {
      return next([{ message: "Include a valid body in the request" }])
    }
    const { id } = req.params

    const transactionCheckResult = await checkTransactionExistsAndIsAccessible(
      id,
      req.user?.id
    )

    if (transactionCheckResult instanceof AppError) {
      next(transactionCheckResult)
    } else {
      const bodyData = matchedData(req, { locations: ["body"] })
      const updatedTransaction = await new Transaction().updateById(
        id,
        bodyData
      )

      const transactionPrevAmount = transactionCheckResult.amount

      await new Envelope().updateEnvelopeAmountAfterTransactionUpdate(
        transactionCheckResult.envelope_id.toString(),
        transactionPrevAmount,
        bodyData["amount"]
      )

      return res.json(updatedTransaction)
    }
  } catch (error) {
    next(error)
  }
}

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
