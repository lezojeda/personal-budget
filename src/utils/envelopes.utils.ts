import { EnvelopeNotFoundError } from "../classes/EnvelopeNotFoundError"
import { ForbidenError } from "../classes/ForbidenError"
import { Envelope } from "../models/Envelope.model"
import { isEntityFromRequestingUser } from './utils'

const getEnvelopeFromDb = async (id: string) => {
  const queryResult = await new Envelope().getById(id)

  if (queryResult.rowCount > 0) {
    return queryResult.rows[0]
  }

  return null
}

const checkEnvelopeExistsAndIsAccessible = async (
  id: string,
  requestingUserId?: number
) => {
  const envelope = await getEnvelopeFromDb(id)

  if (envelope === null) {
    return new EnvelopeNotFoundError(id)
  }

  if (!isEntityFromRequestingUser(envelope.user_id, requestingUserId)) {
    return new ForbidenError(id)
  }

  return envelope
}

export { checkEnvelopeExistsAndIsAccessible }
