import { dbQuery } from "../db"

class Base {
  id: number

  static table: string

  static async findById(id: string) {
    const queryText = `SELECT * FROM ${this.table} WHERE id = $1`
    return await dbQuery(queryText, [id])
  }
}

export { Base }
