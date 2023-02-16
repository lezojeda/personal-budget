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

  public async getAllTransactionsFromUser(userId?: string) {
    const queryText = `
      SELECT id, amount, timestamp, envelope_id FROM ${this.table}
      WHERE user_id = $1`
    return await dbQuery<Transaction>(queryText, [userId])
  }
}

export { Transaction }
