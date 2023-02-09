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
import {
  checkEnvelopeAccess,
  handleValidationResult,
  validateRequestBody,
} from "../middlewares"

const envelopesRouter = express.Router()

envelopesRouter.use(
  "/:id",
  param("id", MESSAGES.ID_MUST_BE_INT).trim().isInt(),
  handleValidationResult,
  checkEnvelopeAccess
)

envelopesRouter.get("/", getEnvelopes)

envelopesRouter.post(
  "/",
  body("current_amount", MESSAGES.ENVELOPES.CURRENT_AMOUNT_REQUIRED)
    .trim()
    .isFloat({ min: 0 }),
  body("name", MESSAGES.ENVELOPES.NAME_REQUIRED).trim().isString(),
  body("envelope_limit", MESSAGES.ENVELOPES.ENVELOPE_LIMIT_REQUIRED)
    .trim()
    .isFloat({ min: 0 }),
  handleValidationResult,
  validateRequestBody,
  createEnvelope
)

envelopesRouter.post(
  "/transfer",
  query(
    "from",
    "Include a query parameter indicating the envelope id to transfer FROM"
  ).isInt(),
  query(
    "to",
    "Include a query parameter indicating the envelope id to transfer TO"
  ).isString(),
  body("amount", "Include an amount which must be a number").trim().isFloat(),
  handleValidationResult,
  transferBudgets
)

envelopesRouter.delete("/:id", deleteEnvelopeById)

envelopesRouter.get("/:id", getEnvelopeById)

envelopesRouter.patch(
  "/:id",
  body("name", MESSAGES.ENVELOPES.NAME_TYPE)
    .trim()
    .isString()
    .optional({ checkFalsy: true })
    .escape(),
  body("envelope_limit", MESSAGES.ENVELOPES.ENVELOPE_LIMIT_TYPE)
    .trim()
    .isFloat({ min: 0 })
    .optional({ checkFalsy: true })
    .escape(),
  handleValidationResult,
  validateRequestBody,
  updateEnvelopeById
)

envelopesRouter.post(
  "/:id/transactions",
  body("amount", MESSAGES.AMOUNT_REQUIRED).trim().isFloat({ min: 0 }),
  handleValidationResult,
  validateRequestBody,
  createEnvelopeTransaction
)

export { envelopesRouter }
