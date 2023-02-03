import { Request, Response, NextFunction } from "express"
import { matchedData } from "express-validator/src/matched-data"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../classes/AppError"
import { UnauthorizedError } from "../classes/UnauthorizedError"
import { Envelope } from "../models/Envelope.model"
import { checkEnvelopeExistsAndIsAccessible } from "../utils/envelopes.utils"

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
  try {
    if (Object.keys(req.body).length === 0) {
      return next([{ message: "Include a body in the request" }])
    }

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
          ...queryResult.rows[0],
        },
      })
    }

    next(new UnauthorizedError())
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

    await Promise.all(
      Object.keys(req.query).map(async (key) => {
        const envelopeId = req.query[key]
        if (envelopeId && typeof envelopeId === "string") {
          const error = await checkEnvelopeExistsAndIsAccessible(
            envelopeId,
            req.session.passport?.user
          )

          if (error) {
            errors.push(error)
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
    const { id } = req.params

    const checkResultError = checkEnvelopeExistsAndIsAccessible(
      id,
      req.session.passport?.user
    )

    if (checkResultError === null) {
      await new Envelope().deleteById(req.params.id)
    } else {
      next(checkResultError)
    }

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

    const checkResultError = await checkEnvelopeExistsAndIsAccessible(
      id,
      req.session.passport?.user
    )

    if (!checkResultError) {
      const bodyData = matchedData(req, { locations: ["body"] })
      if (Object.keys(bodyData).length === 0) {
        return next([{ message: "Include a valid body in the request" }])
      }
      const updatedEnvelope = await new Envelope().updateById(
        req.params.id,
        bodyData
      )
      res.json(updatedEnvelope)
    } else {
      next(checkResultError)
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
}
