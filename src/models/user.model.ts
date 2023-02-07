import { dbQuery } from "../db"
import { TableNames } from "../db/constants"
import { IUser } from "../interfaces/User.interface"
import { Base } from "./Base.model"

class User extends Base<IUser> implements IUser {
  public id: number
  public hash: string
  public salary: number
  public savings: number
  public username: string

  public table = TableNames.Users

  public async getByUsername(username: string) {
    const queryText = `SELECT * FROM ${this.table} WHERE username = $1`
    const queryResult = await dbQuery<User>(queryText, [username])

    if (queryResult.rowCount > 0) {
      return queryResult.rows[0]
    }
    return null
  }
}

export { User }
