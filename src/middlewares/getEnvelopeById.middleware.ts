import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../classes/AppError"
import { ForbidenError } from "../classes/ForbidenError"
import { Envelope } from "../models/Envelope.model"

export const getEnvelopeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const queryResult = await new Envelope().getById(id)

  if (queryResult.rowCount > 0) {
    const envelope = queryResult.rows[0]

    const requestingUser = req.session.passport?.user
    const envelopeOwnerUser =  envelope.user_id
    const usersMatch = requestingUser === envelopeOwnerUser

    if (!usersMatch) {
      return next(new ForbidenError())
    } else {
      req.envelope = envelope
      return next()
    }
  }
  const notFoundError = new AppError({
    message: `The envelope with id ${id} doesn't exist`,
    httpStatusCode: StatusCodes.NOT_FOUND,
  })
  return next(notFoundError)
}
