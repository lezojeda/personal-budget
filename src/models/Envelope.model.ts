import { executeTransaction } from "../db"
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

  public async createEnvelope(values: {
    envelope_limit: number
    name: string
    userId?: number
  }) {
    const queryResult = await this.create(
      ["current_amount", "envelope_limit", "name", "user_id"],
      [0, ...Object.values(values)]
    )

    return queryResult
  }

  public async updateEnvelopeAmount(id: string, amount: number) {
    const queryText = `UPDATE ${this.table} SET current_amount = current_amount + cast($1 as money) WHERE id = $2 RETURNING *`

    const queryResult = await executeTransaction<Envelope>(queryText, [
      amount,
      id,
    ])

    return queryResult
  }

  public async updateEnvelopeAmountAfterTransactionUpdate(
    id: string,
    prevTransactionAmount: number,
    newTransactionAmount: number
  ) {
    const queryText = `UPDATE ${this.table} SET current_amount = current_amount + cast($1 as money) - cast($2 as money) WHERE id = $3 RETURNING *`

    const queryResult = await executeTransaction<Envelope>(queryText, [
      prevTransactionAmount,
      newTransactionAmount,
      id,
    ])

    return queryResult
  }

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

    return await executeTransaction<Envelope>(queryText, [
      amount,
      originId,
      destinationId,
    ])
  }
}

export { Envelope }
