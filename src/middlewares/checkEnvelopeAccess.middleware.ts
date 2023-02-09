import { Request, Response, NextFunction } from "express"
import { AppError } from '../classes/AppError'
import { checkEnvelopeExistsAndIsAccessible } from '../utils/envelopes.utils'

const checkEnvelopeAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params

  const envelopeCheckResult = await checkEnvelopeExistsAndIsAccessible(
    id,
    req.user?.id
  )

  if (envelopeCheckResult instanceof AppError) {
    next(envelopeCheckResult)
  } else {
    req.envelope = envelopeCheckResult
    next()
  }
}

export { checkEnvelopeAccess }
