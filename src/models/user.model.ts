import { TableNames } from '../db/constants'
import { Base } from "./base.model"

class User extends Base {
  static table = TableNames.Users
}

export { User }
