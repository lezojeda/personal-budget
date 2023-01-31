import { QueryResultRow } from "pg"
import { User } from '../models/user.model'

export interface IUser {
  id: number
  salary: number
  savings: number
  username: string
  hash: string

  getByUsername(username: string): Promise<User>
}
