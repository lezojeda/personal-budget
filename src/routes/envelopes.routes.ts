import express from "express"
import { createEnvelope, getEnvelopeById, getEnvelopes } from "../controllers"

const envelopesRouter = express.Router()

envelopesRouter.get("/", getEnvelopes)

envelopesRouter.get("/:id", getEnvelopeById)

envelopesRouter.post("/", createEnvelope)

export { envelopesRouter }
