import express from "express"
import { createEnvelope, getEnvelopeById } from "../controllers"

const envelopesRouter = express.Router()

envelopesRouter.get("/:id", getEnvelopeById)

envelopesRouter.post("/", createEnvelope)

export { envelopesRouter }
