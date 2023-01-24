import express from "express"
import { createEnvelope } from '../controllers'

const envelopesRouter = express.Router()

envelopesRouter.post("/", createEnvelope)

export { envelopesRouter }
