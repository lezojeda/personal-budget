import { EnvelopeNotFoundError } from "../classes/EnvelopeNotFoundError"
import { ForbidenError } from "../classes/ForbidenError"
import { Envelope } from "../models/Envelope.model"

const getEnvelopeFromDb = async (id: string) => {
  const queryResult = await new Envelope().getById(id)

  if (queryResult.rowCount > 0) {
    return queryResult.rows[0]
  }

  return null
}

const isEnvelopeFromRequestingUser = (
  envelopeOwnerUserId: number,
  requestingUserId?: number
) => {
  return requestingUserId === envelopeOwnerUserId
}

const checkEnvelopeExistsAndIsAccessible = async (
  id: string,
  requestingUserId?: number
) => {
  const envelope = await getEnvelopeFromDb(id)

  if (envelope === null) {
    return new EnvelopeNotFoundError(id)
  }

  if (!isEnvelopeFromRequestingUser(envelope.user_id, requestingUserId)) {
    return new ForbidenError(id)
  }
}

export { checkEnvelopeExistsAndIsAccessible }
