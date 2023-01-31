import express from "express"
import { body } from "express-validator"
import {
  createEnvelope,
  deleteEnvelopeById,
  getEnvelopeById,
  getEnvelopes,
  updateEnvelopeById,
} from "../controllers"
import { getEnvelopeById as getEnvelopeByIdMiddleware } from "../middlewares"

const envelopesRouter = express.Router()

envelopesRouter.get("/", getEnvelopes)

envelopesRouter.post(
  "/",
  body("current_amount").isFloat(),
  body("name").isString(),
  body("envelope_limit").isFloat(),
  createEnvelope
)

envelopesRouter.delete("/:id", getEnvelopeByIdMiddleware, deleteEnvelopeById)

envelopesRouter.get("/:id", getEnvelopeByIdMiddleware, getEnvelopeById)

envelopesRouter.patch(
  "/:id",
  getEnvelopeByIdMiddleware,
  body("name").isString(),
  body("envelope_limit").isFloat(),
  updateEnvelopeById
)

export { envelopesRouter }
