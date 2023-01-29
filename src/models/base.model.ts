import { dbQuery, executeTransaction } from "../db"

class Base {
  id: number

  static table: string

  static async create(columns: string[], values: string[]) {
    const transactionText = `INSERT INTO ${
      this.table
    }(${columns.join()}) VALUES(${values
      .map((value, index) => "$" + (index + 1))
      .join()}) RETURNING id`

    return await executeTransaction(transactionText, values)
  }

  static async deleteById(id: string) {
    const transactionText = `DELETE FROM ${this.table} WHERE id = $1`

    return await executeTransaction(transactionText, [id])
  }

  static async getAllFromUser(userId: string) {
    const queryText = `SELECT * FROM ${this.table} WHERE user_id = $1`
    return await dbQuery(queryText, [userId])
  }

  static async getById(id: string) {
    const queryText = `SELECT * FROM ${this.table} WHERE id = $1`

    return await dbQuery(queryText, [id])
  }
}

export { Base }
