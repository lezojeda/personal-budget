import { dbQuery } from "../db"
import { TableNames } from "../db/constants"
import { IEnvelope } from "../interfaces/Envelope.interface"
import { Base } from "./Base.model"

class Envelope extends Base<IEnvelope> implements IEnvelope {
  public id: number
  public current_amount?: number
  public envelope_limit: number
  public name: string
  public user_id: number

  public table = TableNames.Envelopes

  public async transferBudgets(
    originId: string,
    destinationId: string,
    amount: number
  ) {
    const queryText = `UPDATE ${this.table}
    SET current_amount =
        CASE 
          WHEN id = $2 THEN current_amount - cast($1 as money)
          WHEN id = $3 THEN current_amount + cast($1 as money)
          ELSE current_amount
        END RETURNING *;`

    return await dbQuery<Envelope>(queryText, [
      amount,
      originId,
      destinationId,
    ])
  }
}

export { Envelope }
