import { Request, Response, NextFunction } from "express"
import { matchedData } from "express-validator/src/matched-data"
import { StatusCodes } from "http-status-codes"
import { UnauthorizedError } from "../classes/UnauthorizedError"
import { Envelope } from "../models/Envelope.model"

const getEnvelopes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.session.passport?.user
  if (userId) {
    const queryResult = await new Envelope().getAllFromUser(userId.toString())

    return res.json(queryResult.rows)
  }

  next(new UnauthorizedError())
}

const createEnvelope = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
const userId = req.session.passport?.user

  if (userId) {
    const { current_amount, limit, name } = req.body

    const queryResult = await new Envelope().create(
      ["current_amount", "envelope_limit", "name", "user_id"],
      [current_amount, limit, name, userId]
    )

    return res.status(201).json({
      message: "Envelope created successfully",
      envelope: {
        ...queryResult.rows[0]
      },
    })
  }

  next(new UnauthorizedError())
}

const deleteEnvelopeById = async (req: Request, res: Response) => {
  await new Envelope().deleteById(req.params.id)

  res.status(StatusCodes.NO_CONTENT).send()
}

const getEnvelopeById = async (req: Request, res: Response) => {
  res.json(req.envelope)
}

const updateEnvelopeById = async (req: Request, res: Response) => {
  const bodyData = matchedData(req, { locations: ["body"] },)
  const queryResult = await new Envelope().updateById(req.params.id, bodyData)
  res.json(queryResult.rows[0])
}

export {
  getEnvelopes,
  createEnvelope,
  deleteEnvelopeById,
  getEnvelopeById,
  updateEnvelopeById,
}
