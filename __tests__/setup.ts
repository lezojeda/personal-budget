import { Server } from "http"
import { QueryResult } from "pg"
import createApp from "../createApp"
import { getPool } from "../src/db"
import { IEnvelope } from "../src/interfaces/Envelope.interface"
import { IUser } from "../src/interfaces/User.interface"
import { Envelope } from "../src/models/Envelope.model"
import { User } from "../src/models/User.model"
import { hashPassword } from "../src/utils/auth.utils"

module.exports = async function () {
  let app = createApp()
  let server: Server

  server = app.listen()

  await createUsers()
  await createEnvelopes()

  server.close()
  getPool().end()
}

async function createUsers() {
  const users = [
    {
      username: "test",
      password: "password",
    },
    {
      username: "test2",
      password: "password",
    },
  ]
  let hashesPromises: Promise<string | null>[] = []

  users.forEach((u) => hashesPromises.push(hashPassword(u.password, 1)))

  const hashes = await Promise.all(hashesPromises)

  await new User().create(["username", "hash"], [users[0].username, hashes[0]])
  await new User().create(["username", "hash"], [users[1].username, hashes[1]])
}

async function createEnvelopes() {
  const envelopes = [
    {
      current_amount: 100,
      envelope_limit: 1000,
      name: "Envelope 1",
      user_id: 1,
    },
    {
      current_amount: 200,
      envelope_limit: 2000,
      name: "Envelope 2",
      user_id: 1,
    },
    {
      current_amount: 300,
      envelope_limit: 3000,
      name: "Envelope 3",
      user_id: 1,
    },
    {
      current_amount: 400,
      envelope_limit: 4000,
      name: "Envelope 4",
      user_id: 1,
    },
    {
      current_amount: 500,
      envelope_limit: 5000,
      name: "Envelope 5",
      user_id: 1,
    },
    {
      current_amount: 600,
      envelope_limit: 6000,
      name: "Envelope 6",
      user_id: 1,
    },
    {
      current_amount: 700,
      envelope_limit: 7000,
      name: "Envelope 7",
      user_id: 1,
    },
    {
      current_amount: 800,
      envelope_limit: 8000,
      name: "Envelope 8",
      user_id: 1,
    },
    {
      current_amount: 900,
      envelope_limit: 9000,
      name: "Envelope 9",
      user_id: 1,
    },
    {
      current_amount: 1000,
      envelope_limit: 10000,
      name: "Envelope 10",
      user_id: 1,
    },
  ]

  let promises: Promise<QueryResult<IEnvelope>>[] = []

  envelopes.forEach((e) => promises.push(new Envelope().createEnvelope(e)))

  await Promise.all(promises)
}
