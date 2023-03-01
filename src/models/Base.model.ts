import { QueryResultRow } from "pg"
import { dbQuery, executeTransaction } from "../db"
import { TableNames } from "../db/constants"

abstract class Base<T extends QueryResultRow> {
  public table: TableNames

  public async create(columns: string[], values: (string | number)[]) {
    const transactionText = `INSERT INTO ${
      this.table
    }(${columns.join()}) VALUES(${values
      .map((value, index) => "$" + (index + 1))
      .join()}) RETURNING id`

    return await executeTransaction<T>(transactionText, values)
  }

  public async deleteById(id: string) {
    const transactionText = `DELETE FROM ${this.table} WHERE id = $1`

    return await executeTransaction<T>(transactionText, [id])
  }

  public async getAllFromUser(userId: string) {
    const queryText = `SELECT * FROM ${this.table} WHERE user_id = $1`
    return await dbQuery<T>(queryText, [userId])
  }

  public async getById(id: string) {
    const queryText = `SELECT * FROM ${this.table} WHERE id = $1`

    return await dbQuery<T>(queryText, [id])
  }

  public async updateById(id: string, body: { [index: string]: string }) {
    const setClause = Object.keys(body)
      .map((key, index) => {
        return `${key} = $${index + 1}`
      })
      .join()

    const values = [...Object.values(body), id]

    const queryText = `UPDATE ${this.table} SET ${setClause} WHERE id = $${values.length} RETURNING *`

    const queryResult = await executeTransaction<T>(queryText, values)

    return queryResult
  }
}

export { Base }
