import { Request, Response, NextFunction } from "express"
import { matchedData } from "express-validator/src/matched-data"
import { StatusCodes } from "http-status-codes"
import { AppError } from "../classes/AppError"
import { UnauthorizedError } from "../classes/UnauthorizedError"
import { Envelope } from "../models/Envelope.model"
import { Transaction } from "../models/Transaction.model"
import { checkEnvelopeExistsAndIsAccessible } from "../utils/envelopes.utils"

const getEnvelopes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.session.passport?.user
    if (userId) {
      const queryResult = await new Envelope().getAllFromUser(userId.toString())

      return res.json(queryResult.rows)
    }

    throw new UnauthorizedError()
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
    if (Object.keys(req.body).length === 0) {
      return next([{ message: "Include a body in the request" }])
    }

    const userId = req.session.passport?.user

    if (userId) {
      const { current_amount, envelope_limit, name } = req.body

      const queryResult = await new Envelope().createEnvelope({
        current_amount,
        envelope_limit,
        name,
        userId,
      })

      return res.status(201).json({
        message: "Envelope created successfully",
        envelope: {
          ...queryResult.rows[0],
        },
      })
    }

    throw new UnauthorizedError()
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
          const envelopeCheck = await checkEnvelopeExistsAndIsAccessible(
            envelopeId,
            req.session.passport?.user
          )

          if (envelopeCheck instanceof AppError) {
            errors.push(envelopeCheck)
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

    const userId = req.session.passport?.user

    if (userId) {
      const envelopeCheckResult = checkEnvelopeExistsAndIsAccessible(
        id,
        req.session.passport?.user
      )

      if (!envelopeCheckResult) {
        await new Envelope().deleteById(req.params.id)
      } else {
        next(envelopeCheckResult)
      }

      res.status(StatusCodes.NO_CONTENT).send()
    }
    throw new UnauthorizedError()
  } catch (error) {
    next(error)
  }
}

const getEnvelopeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params

  const userId = req.session.passport?.user

  if (userId) {
    const envelopeCheckResult = await checkEnvelopeExistsAndIsAccessible(
      id,
      req.session.passport?.user
    )

    if (envelopeCheckResult instanceof AppError) {
      next(envelopeCheckResult)
    } else {
      res.json(envelopeCheckResult)
    }
  }
  throw new UnauthorizedError()
}

const updateEnvelopeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const envelopeCheckResult = await checkEnvelopeExistsAndIsAccessible(
      id,
      req.session.passport?.user
    )

    if (envelopeCheckResult instanceof AppError) {
      next(envelopeCheckResult)
    } else {
      const bodyData = matchedData(req, { locations: ["body"] })
      if (Object.keys(bodyData).length === 0) {
        return next([{ message: "Include a valid body in the request" }])
      }
      const updatedEnvelope = await new Envelope().updateById(id, bodyData)
      res.json(updatedEnvelope)
    }
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
    const userId = req.session.passport?.user

    if (userId) {
      const { id } = req.params
      const envelopeCheckResult = await checkEnvelopeExistsAndIsAccessible(
        id,
        userId
      )

      if (envelopeCheckResult instanceof AppError) {
        next(envelopeCheckResult)
      } else {
        const bodyData = matchedData(req, { locations: ["body"] })
        const amount = bodyData["amount"]

        const updateEnvelopeQueryResult =
          await new Envelope().updateEnvelopeAmount(id, amount)

        if (updateEnvelopeQueryResult.rowCount > 0) {
          const timestamp = new Date().toISOString().substring(0, 19)
          const queryResult = await new Transaction().createTransaction({
            amount,
            envelope_id: id,
            timestamp,
            user_id: userId,
          })
          res.json(queryResult.rows[0])
        }
      }
    } else {
      throw new UnauthorizedError()
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
