import express from "express"
import { body, oneOf } from "express-validator"
import { MESSAGES } from "../constants/messages"
import {
  createEnvelope,
  deleteEnvelopeById,
  getEnvelopeById,
  getEnvelopes,
  updateEnvelopeById,
} from "../controllers"
import { getEnvelopeById as getEnvelopeByIdMiddleware } from "../middlewares"
import { validateRequestBody } from "../middlewares/validateRequestBody.middleware"

const envelopesRouter = express.Router()

envelopesRouter.get("/", getEnvelopes)

envelopesRouter.post(
  "/",
  body("current_amount", MESSAGES.ENVELOPES.CURRENT_AMOUNT_REQUIRED)
    .trim()
    .isFloat(),
  body("name", MESSAGES.ENVELOPES.NAME_REQUIRED).trim().isString(),
  body("envelope_limit", MESSAGES.ENVELOPES.ENVELOPE_LIMIT_REQUIRED)
    .trim()
    .isFloat(),
  validateRequestBody,
  createEnvelope
)

envelopesRouter.delete("/:id", getEnvelopeByIdMiddleware, deleteEnvelopeById)

envelopesRouter.get("/:id", getEnvelopeByIdMiddleware, getEnvelopeById)

envelopesRouter.patch(
  "/:id",
  getEnvelopeByIdMiddleware,
  body("name", MESSAGES.ENVELOPES.NAME_TYPE)
    .trim()
    .isString()
    .optional({ checkFalsy: true })
    .escape(),
  body("envelope_limit", MESSAGES.ENVELOPES.ENVELOPE_LIMIT_TYPE)
    .trim()
    .isFloat()
    .optional({ checkFalsy: true })
    .escape(),
  validateRequestBody,
  updateEnvelopeById
)

export { envelopesRouter }
