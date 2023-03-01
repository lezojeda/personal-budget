import { Request, Response, NextFunction } from "express"
import { matchedData } from "express-validator"
import { StatusCodes } from "http-status-codes"
import { MESSAGES } from "../constants/messages"
import { Envelope } from "../models/Envelope.model"
import { Transaction } from "../models/Transaction.model"

const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id.toString() as string
    const queryResult = await new Transaction().getAllTransactionsFromUser(
      userId,
      req.query.envelopeId as string
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
      return next([{ message: MESSAGES.VALIDATION.INCLUDE_VALID_BODY }])
    }

    const updatedTransactionResponse = await new Transaction().updateById(
      id,
      bodyData
    )

    /**
     * Update envelope with the new transaction's amount
     */
    const transactionPrevAmount = transaction.amount

    await new Envelope().updateEnvelopeAmountAfterTransactionUpdate(
      transaction.envelope_id.toString(),
      transactionPrevAmount,
      bodyData["amount"]
    )

    return res.json(updatedTransactionResponse.rows[0])
  } catch (error) {
    next(error)
  }
}

const deleteTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await new Transaction().deleteById(req.params.id)

    res.status(StatusCodes.NO_CONTENT).send()
  } catch (error) {
    next(error)
  }
}

export {
  getTransactions,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
}
