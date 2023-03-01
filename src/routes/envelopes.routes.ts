import express from "express"
import { body, param, query } from "express-validator"
import { MESSAGES } from "../constants/messages"
import {
  createEnvelope,
  createEnvelopeTransaction,
  deleteEnvelopeById,
  getEnvelopeById,
  getEnvelopes,
  transferBudgets,
  updateEnvelopeById,
} from "../controllers"
import { checkEnvelopeAccess, handleValidationResult } from "../middlewares"

const envelopesRouter = express.Router()

envelopesRouter.use(
  "/:id",
  param("id", MESSAGES.PATH_ID_MUST_BE_INT).trim().isInt(),
  handleValidationResult,
  checkEnvelopeAccess
)

envelopesRouter.get("/", getEnvelopes)

envelopesRouter.post(
  "/",
  [
    body("name", MESSAGES.ENVELOPES.NAME_REQUIRED).trim().isString().notEmpty(),
    body("envelope_limit", MESSAGES.ENVELOPES.ENVELOPE_LIMIT_REQUIRED).isFloat({
      min: 0,
    }),
  ],
  handleValidationResult,
  createEnvelope
)

envelopesRouter.post(
  "/transfer",
  [
    query(
      "from",
      "Include a query parameter indicating the envelope id to transfer FROM"
    ).isInt(),
    query(
      "to",
      "Include a query parameter indicating the envelope id to transfer TO"
    ).isInt(),
    body("amount", "Include an amount which must be a number").isFloat(),
  ],
  handleValidationResult,
  transferBudgets
)

envelopesRouter.delete("/:id", deleteEnvelopeById)

envelopesRouter.get("/:id", getEnvelopeById)

envelopesRouter.patch(
  "/:id",
  [
    body("name", MESSAGES.ENVELOPES.NAME_TYPE)
      .isString()
      .optional({ checkFalsy: true }),
    body("envelope_limit", MESSAGES.ENVELOPES.ENVELOPE_LIMIT_TYPE)
      .isFloat({ min: 0 })
      .optional({ checkFalsy: true }),
  ],
  handleValidationResult,
  updateEnvelopeById
)

envelopesRouter.post(
  "/:id/transactions",
  body("amount", MESSAGES.AMOUNT_REQUIRED).isFloat({ min: 0 }),
  handleValidationResult,
  createEnvelopeTransaction
)

export { envelopesRouter }
