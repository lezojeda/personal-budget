import { compare, genSalt, hash } from "bcrypt"

const hashPassword = async (password: string, saltRounds: number) => {
  try {
    const salt = await genSalt(saltRounds)

    return await hash(password, salt)
  } catch (error) {
    console.error(error)
  }
  return null
}

const comparePasswords = async (password: string, hash: string) => {
  try {
    const matchFound = await compare(password, hash)

    return matchFound
  } catch (error) {
    console.error(error)
  }
  return false
}

export { comparePasswords, hashPassword }
