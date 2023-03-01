import { dbQuery } from "../db"
import { TableNames } from "../db/constants"
import { ITransaction } from "../interfaces/Transaction.interface"
import { Base } from "./Base.model"

class Transaction extends Base<ITransaction> implements ITransaction {
  id: number
  amount: number
  envelope_id: number
  user_id: number
  timestamp: string

  public table = TableNames.Transactions

  public async createTransaction(values: {
    amount: number
    envelope_id: number
    timestamp: string
    user_id?: number
  }) {
    const queryResult = await this.create(
      ["amount", "envelope_id", "timestamp", "user_id"],
      Object.values(values)
    )

    return queryResult
  }

  public async getAllTransactionsFromUser(userId: string, envelopeId?: string) {
    let queryText = `
      SELECT id, amount, timestamp, envelope_id FROM ${this.table}
      WHERE user_id = $1`

    const values = [userId]

    if (envelopeId) {
      values.push(envelopeId)
      queryText = queryText + " AND envelope_id = $2"
    }
    return await dbQuery<Transaction>(queryText, values)
  }
}

export { Transaction }
