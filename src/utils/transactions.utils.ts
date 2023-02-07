import { EnvelopeNotFoundError } from "../classes/EnvelopeNotFoundError"
import { ForbidenError } from "../classes/ForbidenError"
import { Transaction } from '../models/Transaction.model'
import { isEntityFromRequestingUser } from './utils'

const getTransactionFromDb = async (id: string) => {
  const queryResult = await new Transaction().getById(id)

  if (queryResult.rowCount > 0) {
    return queryResult.rows[0]
  }

  return null
}

const checkTransactionExistsAndIsAccessible = async (
  id: string,
  requestingUserId?: number
) => {
  const transaction = await getTransactionFromDb(id)

  if (transaction === null) {
    throw new EnvelopeNotFoundError(id)
  }

  if (!isEntityFromRequestingUser(transaction.user_id, requestingUserId)) {
    throw new ForbidenError(id)
  }

  return transaction
}

export { checkTransactionExistsAndIsAccessible }
