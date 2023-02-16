import { Server } from "http"
import { QueryResult } from "pg"
import createApp from "../createApp"
import { getPool } from "../src/db"
import { IEnvelope } from "../src/interfaces/Envelope.interface"
import { ITransaction } from "../src/interfaces/Transaction.interface"
import { Envelope } from "../src/models/Envelope.model"
import { Transaction } from "../src/models/Transaction.model"
import { User } from "../src/models/User.model"
import { hashPassword } from "../src/utils/auth.utils"

module.exports = async function () {
  let app = createApp()
  let server: Server

  server = app.listen()

  await createUsers()
  await createEnvelopes()
  await createTransactions()

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

async function createTransactions() {
  const transactions = [
    {
      amount: 10,
      envelope_id: 1,
      timestamp: "2023-02-15T13:27:45.000Z",
      user_id: 1,
    },
    {
      amount: 5,
      envelope_id: 1,
      timestamp: "2023-05-20T09:13:21.000Z",
      user_id: 1,
    },
    {
      amount: 8,
      envelope_id: 1,
      timestamp: "2023-07-09T20:42:16.000Z",
      user_id: 1,
    },
    {
      amount: 7,
      envelope_id: 1,
      timestamp: "2023-04-03T07:35:57.000Z",
      user_id: 1,
    },
    {
      amount: 3,
      envelope_id: 1,
      timestamp: "2023-08-29T16:02:34.000Z",
      user_id: 1,
    },
    {
      amount: 1,
      envelope_id: 1,
      timestamp: "2023-12-11T21:47:11.000Z",
      user_id: 1,
    },
    {
      amount: 6,
      envelope_id: 1,
      timestamp: "2023-10-02T04:58:02.000Z",
      user_id: 1,
    },
    {
      amount: 5,
      envelope_id: 1,
      timestamp: "2023-01-30T19:16:48.000Z",
      user_id: 1,
    },
    {
      amount: 4,
      envelope_id: 1,
      timestamp: "2023-06-05T11:08:27.000Z",
      user_id: 1,
    },
    {
      amount: 1,
      envelope_id: 1,
      timestamp: "2023-09-18T14:39:09.000Z",
      user_id: 1,
    },
  ]

  let promises: Promise<QueryResult<ITransaction>>[] = []

  transactions.forEach((t) =>
    promises.push(new Transaction().createTransaction(t))
  )

  await Promise.all(promises)
}
