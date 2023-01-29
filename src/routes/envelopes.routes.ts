import express from "express"
import {
  createEnvelope,
  deleteEnvelopeById,
  getEnvelopeById,
  getEnvelopes,
  updateEnvelopeById,
} from "../controllers"
import { getEnvelopeById as getEnvelopeByIdMiddleware } from "../middlewares/getEnvelopeById.middleware"

const envelopesRouter = express.Router()

envelopesRouter.get("/", getEnvelopes)

envelopesRouter.post("/", createEnvelope)

envelopesRouter.delete("/:id", getEnvelopeByIdMiddleware, deleteEnvelopeById)

envelopesRouter.get("/:id", getEnvelopeByIdMiddleware, getEnvelopeById)

envelopesRouter.patch("/:id", getEnvelopeByIdMiddleware, updateEnvelopeById)

export { envelopesRouter }
