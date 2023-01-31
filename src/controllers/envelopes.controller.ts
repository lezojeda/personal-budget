import { Request, Response, NextFunction } from "express"
import { matchedData } from "express-validator/src/matched-data"
import { validationResult } from "express-validator/src/validation-result"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../classes/AppError"
import { ForbidenError } from "../classes/ForbidenError"
import { UnauthorizedError } from "../classes/UnauthorizedError"
import { Envelope } from "../models/envelope.model"

const getEnvelopes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.session.passport?.user
  if (userId) {
    const queryResult = await Envelope.getAllFromUser(userId)

    return res.json(queryResult.rows)
  }

  next(new UnauthorizedError())
}

const createEnvelope = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const errArray = errors.array()

    return next(
      errArray.map((e) => {
        return { message: `${e.param}: ${e.msg}` }
      })
    )
  }
  const userId = req.session.passport?.user

  if (userId) {
    const { current_amount, limit, name } = req.body

    const queryResult = await Envelope.create(
      ["current_amount", "envelope_limit", "name", "user_id"],
      [current_amount, limit, name, userId]
    )

    return res.status(201).json({
      message: "Envelope created successfully",
      user: {
        id: queryResult.rows[0].id,
        name,
      },
    })
  }

  next(new UnauthorizedError())
}

const deleteEnvelopeById = async (req: Request, res: Response) => {
  await Envelope.deleteById(req.params.id)

  res.status(StatusCodes.NO_CONTENT).send()
}

const getEnvelopeById = async (req: Request, res: Response) => {
  res.json(req.envelope)
}

const updateEnvelopeById = async (req: Request, res: Response) => {
  const bodyData = matchedData(req, { locations: ["body"] })
  const queryResult = await Envelope.updateById(req.params.id, bodyData)
  res.json(queryResult.rows[0])
}

export {
  getEnvelopes,
  createEnvelope,
  deleteEnvelopeById,
  getEnvelopeById,
  updateEnvelopeById,
}
