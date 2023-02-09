import { Envelope } from "../models/Envelope.model"
import { ITransaction } from './Transaction.interface'

export {}

declare global {
  namespace Express {
    interface User {
      id: number
    }

    interface Request {
      envelope: IEnvelope
      transaction: ITransaction
    }
  }
}
