import { Server } from "http"
import supertest from "supertest"
import createApp from "../../createApp"
import { MESSAGES } from "../../src/constants/messages"
import { getPool } from "../../src/db"

describe("POST", () => {
  let app = createApp()
  let server: Server

  const route = "/auth"
  const testUser = {
    username: "authTestUser",
    password: "password",
  }

  beforeAll(() => {
    server = app.listen()
  })

  afterAll(() => {
    server.close()
    getPool().end()
  })

  describe("SIGN UP", () => {
    it("should not let user sign up without username", async () => {
      const expectedBody = {
        errors: [
          {
            message: MESSAGES.AUTH.USERNAME_REQUIRED,
          },
        ],
      }

      const response = await supertest(app)
        .post(`${route}/signup`)
        .send({ password: "123" })

      expect(response.statusCode).toEqual(400)
      expect(response.body).toStrictEqual(expectedBody)
    })

    it("should not let user sign up without password", async () => {
      const expectedBody = {
        errors: [
          {
            message: MESSAGES.AUTH.PASSWORD_REQUIRED,
          },
        ],
      }

      const response = await supertest(app)
        .post(`${route}/signup`)
        .send({ username: "username" })

      expect(response.statusCode).toEqual(400)
      expect(response.body).toStrictEqual(expectedBody)
    })

    it("should let user sign up", async () => {
      const response = await supertest(app)
        .post(`${route}/signup`)
        .send(testUser)

      expect(response.statusCode).toEqual(201)
    })

    it("should not let user sign up with an already taken username", async () => {
      const expectedBody = {
        errors: [
          {
            message: MESSAGES.AUTH.USERNAME_TAKEN,
          },
        ],
      }

      const response = await supertest(app)
        .post(`${route}/signup`)
        .send(testUser)

      expect(response.statusCode).toEqual(409)
      expect(response.body).toStrictEqual(expectedBody)
    })
  })

  describe("SIGN IN", () => {
    it("should let user sign in", async () => {
      const response = await supertest(app)
        .post(`${route}/signin`)
        .send({ username: testUser.username, password: testUser.password })

      expect(response.statusCode).toEqual(200)
    })

    it("should not let user sign in with an incorrect password", async () => {
      const expectedBody = {
        errors: [
          {
            message: MESSAGES.AUTH.BAD_CREDENTIALS,
          },
        ],
      }

      const response = await supertest(app)
        .post(`${route}/signin`)
        .send({ username: testUser.username, password: "incorrect password" })

      expect(response.statusCode).toEqual(401)
      expect(response.body).toStrictEqual(expectedBody)
    })
  })
})
