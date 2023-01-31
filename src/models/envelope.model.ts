import { TableNames } from '../db/constants'
import { IEnvelope } from '../interfaces/Envelope.interface'
import { Base } from "./Base.model"

class Envelope extends Base<IEnvelope> implements IEnvelope {
  public id: number
  public current_amount?: number
  public envelope_limit: number
  public name: string
  public user_id: number

  public table = TableNames.Envelopes
}

export { Envelope }
