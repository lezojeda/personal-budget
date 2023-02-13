import { Server } from "http"
import supertest from "supertest"
import createApp from "../../createApp"
import { getPool } from "../../src/db"

const route = "/auth"

describe("POST", () => {
  let app = createApp()
  let server: Server

  beforeAll(() => {
    server = app.listen()
  })

  afterAll(() => {
    server.close()
    getPool().end()
  })

  it("should let user sign up", async () => {
    const newUser = {
      username: "test",
      password: "password",
    }

    const response = await supertest(app).post(`${route}/signup`).send(newUser)

    expect(response.statusCode).toEqual(201)
  })

  it("should let user sign in", async () => {
    const newUser = {
      username: "test2",
      password: "password",
    }

    await supertest(app).post(`${route}/signup`).send(newUser)

    const response = await supertest(app).post(`${route}/signin`).send(newUser)

    expect(response.statusCode).toEqual(200)
  })
})
