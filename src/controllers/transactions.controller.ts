import { Request, Response, NextFunction } from "express"
import { matchedData } from "express-validator"
import { ForbidenError } from "../classes/ForbidenError"
import { Envelope } from "../models/Envelope.model"
import { Transaction } from "../models/Transaction.model"

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
    return res.json(req.transaction)
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
    const { id } = req.params
    const { transaction } = req
    const bodyData = matchedData(req, { locations: ["body"] })
    if (Object.keys(bodyData).length === 0) {
      return next([{ message: "Include a valid body in the request" }])
    }

    const updatedTransaction = await new Transaction().updateById(id, bodyData)

    const transactionPrevAmount = transaction.amount

    await new Envelope().updateEnvelopeAmountAfterTransactionUpdate(
      transaction.envelope_id.toString(),
      transactionPrevAmount,
      bodyData["amount"]
    )

    return res.json(updatedTransaction)
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
