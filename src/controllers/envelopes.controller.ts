import { Request, Response, NextFunction } from "express"
import { matchedData } from "express-validator/src/matched-data"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../classes/AppError"
import { MESSAGES } from "../constants/messages"
import { Envelope } from "../models/Envelope.model"
import { Transaction } from "../models/Transaction.model"
import { checkEnvelopeExistsAndIsAccessible } from "../utils/envelopes.utils"

const getEnvelopes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryResult = await new Envelope().getAllFromUser(
      req.user?.id.toString()
    )

    return res.json(queryResult.rows)
  } catch (error) {
    next(error)
  }
}

const createEnvelope = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { current_amount, envelope_limit, name } = req.body

    const queryResult = await new Envelope().createEnvelope({
      current_amount,
      envelope_limit,
      name,
      userId: req.user?.id,
    })

    return res.status(201).json({
      message: MESSAGES.ENVELOPES.CREATION_SUCCESSFUL,
      envelope: {
        ...queryResult.rows[0],
      },
    })
  } catch (error) {
    next(error)
  }
}

const transferBudgets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors: AppError[] = []

    const envelopeIds = Object.values(req.query) as string[]
    await Promise.all(
      envelopeIds.map(async (id) => {
        if (id) {
          try {
            const envelopeCheck = await checkEnvelopeExistsAndIsAccessible(
              id,
              req.session.passport?.user
            )

            if (envelopeCheck instanceof AppError) {
              throw envelopeCheck
            }
          } catch (error) {
            errors.push(error as AppError)
          }
        }
      })
    )

    if (errors.length > 0) {
      return next(errors)
    }

    const bodyData = matchedData(req, { locations: ["body"] })

    const queryResult = await new Envelope().transferBudgets(
      req.query.from as string,
      req.query.to as string,
      bodyData.amount
    )

    res.json(queryResult.rows)
  } catch (error) {
    next(error)
  }
}

const deleteEnvelopeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await new Envelope().deleteById(req.params.id)

    res.status(StatusCodes.NO_CONTENT).send()
  } catch (error) {
    next(error)
  }
}

const getEnvelopeById = async (req: Request, res: Response) => {
  res.json(req.envelope)
}

const updateEnvelopeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const bodyData = matchedData(req, { locations: ["body"] })
    if (Object.keys(bodyData).length === 0) {
      return next([{ message: MESSAGES.VALIDATION.INCLUDE_VALID_BODY }])
    }

    const queryResult = await new Envelope().updateById(id, bodyData)

    const updatedEnvelope = queryResult.rows[0]
    res.json(updatedEnvelope)
  } catch (error) {
    next(error)
  }
}

const createEnvelopeTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const userId = req.user?.id
    const bodyData = matchedData(req, { locations: ["body"] })
    const amount = bodyData["amount"]

    const updateEnvelopeQueryResult = await new Envelope().updateEnvelopeAmount(
      id,
      -amount
    )

    if (updateEnvelopeQueryResult.rowCount > 0) {
      const timestamp = new Date().toISOString().substring(0, 19)
      const queryResult = await new Transaction().createTransaction({
        amount,
        envelope_id: id,
        timestamp,
        user_id: userId,
      })
      res.status(201).json(queryResult.rows[0])
    }
  } catch (error) {
    next(error)
  }
}

export {
  getEnvelopes,
  createEnvelope,
  transferBudgets,
  deleteEnvelopeById,
  getEnvelopeById,
  updateEnvelopeById,
  createEnvelopeTransaction,
}
