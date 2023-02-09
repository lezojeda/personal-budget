import { Request, Response, NextFunction } from "express"
import { EntityNotFoundError } from "../classes/EntityNotFound"
import { ForbidenError } from "../classes/ForbidenError"
import { Transaction } from "../models/Transaction.model"
import { isEntityFromRequestingUser } from "../utils/utils"

const checkTransactionAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params

  const queryResult = await new Transaction().getById(id)

  if (queryResult.rowCount === 0) {
    return next(new EntityNotFoundError("transaction", id))
  }

  const transaction = queryResult.rows[0]

  if (!isEntityFromRequestingUser(transaction.user_id, req.user?.id)) {
    return next(new ForbidenError(id))
  }

  req.transaction = transaction
  next()
}

export { checkTransactionAccess }
