import { TableNames } from '../db/constants'
import { Base } from "./base.model"

class Envelope extends Base {
  static table = TableNames.Envelopes
}

export { Envelope }
