import { Request, Response, NextFunction, query } from "express"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../classes/AppError"
import { ForbidenError } from "../classes/ForbidenError"
import { UnauthorizedError } from "../classes/UnauthorizedError"
import { Envelope } from "../models/envelope.model"

const createEnvelope = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {}

const getEnvelopes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.session.passport?.user
  if (userId) {
    const queryResult = await Envelope.findAllFromUser(userId)

    return res.json(queryResult.rows)
  }

  next(new UnauthorizedError())
}

const getEnvelopeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  const queryResult = await Envelope.findById(id)

  if (queryResult.rowCount > 0) {
    const envelope = queryResult.rows[0]
    if (req.session.passport?.user !== envelope.user_id) {
      return next(new ForbidenError())
    } else {
      return res.json(envelope)
    }
  }
  const notFoundError = new AppError({
    message: `The envelope with id ${id} doesn't exist`,
    httpStatusCode: StatusCodes.NOT_FOUND,
  })
  next(notFoundError)
}

export { createEnvelope, getEnvelopeById, getEnvelopes }
