import { Envelope } from "../models/Envelope.model"

export {}

declare global {
  namespace Express {
    interface User {
      id: number
    }

    interface Request {
      envelope: IEnvelope
    }
  }
}
