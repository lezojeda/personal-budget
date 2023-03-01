import { compare, genSalt, hash } from "bcrypt"

const hashPassword = async (password: string, saltRounds: number) => {
  const salt = await genSalt(saltRounds)

  return await hash(password, salt)
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
