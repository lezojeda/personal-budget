import { Server } from "http"
import supertest from "supertest"
import createApp from "../../createApp"
import { MESSAGES } from "../../src/constants/messages"
import { getPool } from "../../src/db"

describe("Transactions", () => {
  let app = createApp()
  let server: Server
  let cookie: string

  const route = "/transactions"

  beforeAll(async () => {
    server = app.listen()
  })

  afterAll(() => {
    server.close()
    getPool().end()
  })

  describe("User accessing their own transactions", () => {
    beforeAll(async () => {
      const signInResponse = await supertest(app)
        .post("/auth/signin")
        .send({ username: "test", password: "password" })
      cookie = signInResponse.headers["set-cookie"]
    })

    afterAll(async () => {
      await supertest(app).post("/auth/signout")
    })

    describe("GET /transactions", () => {
      it("should return 200 status code and list of user transactions", async () => {
        const response = await supertest(app).get(route).set("Cookie", cookie)

        expect(response.statusCode).toEqual(200)
        expect(response.body.length).toBeGreaterThanOrEqual(10)
      })
    })

    describe("GET /transactions/:id", () => {
      it("should return 200 if transaction exists", async () => {
        const response = await supertest(app)
          .get(`${route}/1`)
          .set("Cookie", cookie)

        expect(response.statusCode).toEqual(200)
      })

      it("should return 404 if it does not exist", async () => {
        const response = await supertest(app)
          .get(`${route}/1500`)
          .set("Cookie", cookie)

        expect(response.statusCode).toEqual(404)
      })

      it("should return a 400 with an incorrect path variable", async () => {
        const expectedBody = {
          errors: [
            {
              message: MESSAGES.ID_MUST_BE_INT,
            },
          ],
        }

        const response = await supertest(app)
          .get(`${route}/test`)
          .set("Cookie", cookie)

        expect(response.statusCode).toEqual(400)
        expect(response.body).toEqual(expectedBody)
      })
    })

    describe("PATCH /transactions/:id", () => {
      it("should return a 200 and the updated transaction", async () => {
        const newAmount = 2

        const transactionToUpdate = await supertest(app)
          .get(`${route}/5`)
          .set("Cookie", cookie)

        const updateResponse = await supertest(app)
          .patch(`${route}/5`)
          .set("Cookie", cookie)
          .send({ amount: newAmount })

        const updatedTransaction = {
          id: transactionToUpdate.body.id,
          amount: `$${newAmount}.00`,
          timestamp: transactionToUpdate.body.timestamp,
          user_id: transactionToUpdate.body.user_id,
          envelope_id: transactionToUpdate.body.envelope_id,
        }

        expect(updateResponse.statusCode).toEqual(200)
        expect(updateResponse.body).toStrictEqual(updatedTransaction)
      })

      it("should return 400 status code if invalid input is provided", async () => {
        const expectedBody = {
          errors: [
            {
              message: MESSAGES.AMOUNT_REQUIRED,
            },
          ],
        }

        const response = await supertest(app)
          .patch(`${route}/1`)
          .set("Cookie", cookie)
          .send({ amount: "amount" })

        expect(response.statusCode).toEqual(400)
        expect(response.body).toStrictEqual(expectedBody)
      })

      it("should return 404 if the transaction does not exist", async () => {
        const response = await supertest(app)
          .get(`${route}/1500`)
          .set("Cookie", cookie)

        expect(response.statusCode).toEqual(404)
      })
    })

    describe("DELETE /transactions/:id", () => {
      it("should return 204 deleting a transaction", async () => {
        const deleteResponse = await supertest(app)
          .delete(`${route}/1`)
          .set("Cookie", cookie)

        const getTransactionResponse = await supertest(app)
          .get(`${route}/1`)
          .set("Cookie", cookie)

        expect(deleteResponse.statusCode).toEqual(204)
        expect(getTransactionResponse.statusCode).toEqual(404)
      })

      it("should return 404 status code if transaction ID does not exist", async () => {
        const response = await supertest(app)
          .delete(`${route}/1500`)
          .set("Cookie", cookie)

        expect(response.statusCode).toEqual(404)
      })
    })
  })

  describe("User trying to access not owned transactions", () => {
    let user2Cookie: string
    beforeAll(async () => {
      const response = await supertest(app)
        .post("/auth/signin")
        .send({ username: "test2", password: "password" })
      user2Cookie = response.headers["set-cookie"]
    })

    afterAll(async () => {
      await supertest(app).post("/auth/signout")
    })

    it("should return 403 trying to get an transaction", async () => {
      const response = await supertest(app)
        .get(`${route}/2`)
        .set("Cookie", user2Cookie)

      expect(response.statusCode).toEqual(403)
    })

    it("should return 403 trying to update an transaction", async () => {
      const newAmount = 15
      const response = await supertest(app)
        .patch(`${route}/2`)
        .set("Cookie", user2Cookie)
        .send({ amount: newAmount })

      expect(response.statusCode).toEqual(403)
    })

    it("should return 403 trying to delete an transaction", async () => {
      const response = await supertest(app)
        .delete(`${route}/2`)
        .set("Cookie", user2Cookie)

      expect(response.statusCode).toEqual(403)
    })
  })
})
