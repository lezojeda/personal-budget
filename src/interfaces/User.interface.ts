import { User } from "../models/User.model"

export interface IUser {
  id: number
  salary?: number
  savings?: number
  username: string
  hash?: string

  getByUsername(username: string): Promise<User | null>
}
