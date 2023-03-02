import { Server } from "http"
import supertest from "supertest"
import createApp from "../../createApp"
import { MESSAGES } from "../../src/constants/messages"
import { getPool } from "../../src/db"

describe("Envelopes", () => {
  const app = createApp()
  let server: Server
  let cookie: string

  const route = "/envelopes"

  beforeAll(async () => {
    server = app.listen()
  })

  afterAll(() => {
    server.close()
    getPool().end()
  })

  describe("User accessing their own envelopes", () => {
    beforeAll(async () => {
      const signInResponse = await supertest(app)
        .post("/auth/signin")
        .send({ username: "test", password: "password" })
      cookie = signInResponse.headers["set-cookie"]
    })

    afterAll(async () => {
      await supertest(app).post("/auth/signout")
    })

    describe("GET /envelopes", () => {
      it("should return 200 and list of user envelopes", async () => {
        const response = await supertest(app).get(route).set("Cookie", cookie)

        expect(response.statusCode).toEqual(200)
        expect(response.body.length).toEqual(10)
      })
    })

    describe("GET /envelopes/:id", () => {
      it("should return 200 if envelope exists", async () => {
        const response = await supertest(app)
          .get(`${route}/1`)
          .set("Cookie", cookie)

        expect(response.statusCode).toEqual(200)
        expect(response.body).toMatchObject({
          envelope_limit: "$1,000.00",
          name: "Envelope 1",
          user_id: 1,
        })
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
              message: MESSAGES.PATH_ID_MUST_BE_INT,
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

    describe("POST/envelopes", () => {
      it("should return 201 and the id after creating an envelope", async () => {
        const testEnvelope = {
          current_amount: 500,
          envelope_limit: 600,
          name: "Gas",
        }

        const response = await supertest(app)
          .post(route)
          .set("Cookie", cookie)
          .send(testEnvelope)

        expect(response.statusCode).toEqual(201)
        expect(response.body).toStrictEqual({
          message: MESSAGES.ENVELOPES.CREATION_SUCCESSFUL,
          envelope: {
            id: 11,
          },
        })
      })

      it("should not be able to create envelope with empty body", async () => {
        const expectedBody = {
          errors: [
            {
              message: MESSAGES.ENVELOPES.NAME_REQUIRED,
            },
            {
              message: MESSAGES.ENVELOPES.ENVELOPE_LIMIT_REQUIRED,
            },
          ],
        }
        const response = await supertest(app).post(route).set("Cookie", cookie)

        expect(response.statusCode).toEqual(400)
        expect(response.body).toStrictEqual(expectedBody)
      })

      it("should not be able to create envelope using strings for body properties", async () => {
        const testEnvelope = {
          current_amount: "amount",
          envelope_limit: "limit",
          name: "Gas",
        }
        const expectedBody = {
          errors: [
            {
              message: MESSAGES.ENVELOPES.ENVELOPE_LIMIT_REQUIRED,
            },
          ],
        }
        const response = await supertest(app)
          .post(route)
          .set("Cookie", cookie)
          .send(testEnvelope)

        expect(response.statusCode).toEqual(400)
        expect(response.body).toStrictEqual(expectedBody)
      })
    })

    describe("POST /envelopes/:id/transactions", () => {
      it("should return 201 and the transaction id after creating an envelope transaction", async () => {
        const expectedBody = {
          message: MESSAGES.TRANSACTIONS.CREATION_SUCCESSFUL,
        }
        const response = await supertest(app)
          .post(`${route}/11/transactions`)
          .set("Cookie", cookie)
          .send({ amount: 10 })

        expect(response.statusCode).toEqual(201)
        expect(response.body).toMatchObject(expectedBody)
      })

      it("should add transaction amount value to the envelope's current_amount", async () => {
        const testEnvelope = {
          current_amount: 0,
          envelope_limit: 600,
          name: "test",
        }
        const transactionAmount = 100
        const expectedNewAmount = `$${
          testEnvelope.current_amount + transactionAmount
        }.00`

        const envelopeResponse = await supertest(app)
          .post(route)
          .set("Cookie", cookie)
          .send(testEnvelope)
        const envelopeId = envelopeResponse.body.envelope.id

        await supertest(app)
          .post(`${route}/${envelopeId}/transactions`)
          .set("Cookie", cookie)
          .send({ amount: transactionAmount })

        const envelopeAfterTransactionResponse = await supertest(app)
          .get(`${route}/${envelopeId}`)
          .set("Cookie", cookie)

        expect(envelopeAfterTransactionResponse.body.current_amount).toEqual(
          expectedNewAmount
        )
      })

      it("should not be able to create envelope transactions without an amount", async () => {
        const expectedBody = {
          errors: [
            {
              message: MESSAGES.AMOUNT_REQUIRED,
            },
          ],
        }
        const response = await supertest(app)
          .post(`${route}/11/transactions`)
          .set("Cookie", cookie)

        expect(response.statusCode).toEqual(400)
        expect(response.body).toStrictEqual(expectedBody)
      })

      it("should not be able to create envelope transaction that would lead to surpass the envelope's limit", async () => {
        const expectedBody = {
          errors: [
            {
              message: MESSAGES.ENVELOPES.AMOUNT_GREATER_THAN_LIMIT,
            },
          ],
        }
        const response = await supertest(app)
          .post(`${route}/11/transactions`)
          .set("Cookie", cookie)
          .send({ amount: 100000 })

        expect(response.statusCode).toEqual(400)
        expect(response.body).toStrictEqual(expectedBody)
      })
    })

    describe("PATCH /envelopes/:id", () => {
      it("should return 200 and the updated envelope", async () => {
        const newName = "groceries"
        const newEnvelopeLimit = 2500

        const envelopeToUpdate = await supertest(app)
          .get(`${route}/1`)
          .set("Cookie", cookie)

        const response = await supertest(app)
          .patch(`${route}/1`)
          .set("Cookie", cookie)
          .send({ name: newName, envelope_limit: newEnvelopeLimit })

        const updatedEnvelope = {
          id: envelopeToUpdate.body.id,
          name: newName,
          current_amount: envelopeToUpdate.body.current_amount,
          envelope_limit: "$2,500.00",
          user_id: envelopeToUpdate.body.user_id,
        }

        expect(response.statusCode).toEqual(200)
        expect(response.body).toStrictEqual(updatedEnvelope)
      })

      it("should return 404 updating an envelope that does not exist", async () => {
        const response = await supertest(app)
          .get(`${route}/1500`)
          .set("Cookie", cookie)

        expect(response.statusCode).toEqual(404)
      })
    })

    describe("DELETE /envelopes/:id", () => {
      it("should return 204 deleting an envelope", async () => {
        const deleteEnvelopeResponse = await supertest(app)
          .delete(`${route}/11`)
          .set("Cookie", cookie)

        const getEnvelopeResponse = await supertest(app)
          .get(`${route}/11`)
          .set("Cookie", cookie)

        expect(deleteEnvelopeResponse.statusCode).toEqual(204)
        expect(getEnvelopeResponse.statusCode).toEqual(404)
      })

      it("should return 404 getting an envelope that does not exist", async () => {
        const response = await supertest(app)
          .get(`${route}/1500`)
          .set("Cookie", cookie)

        expect(response.statusCode).toEqual(404)
      })
    })
  })

  describe("User trying to access not owned envelopes", () => {
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

    it("should return 403 trying to get an envelope", async () => {
      const response = await supertest(app)
        .get(`${route}/1`)
        .set("Cookie", user2Cookie)

      expect(response.statusCode).toEqual(403)
    })

    it("should return 403 trying to update an envelope", async () => {
      const newName = "groceries"
      const response = await supertest(app)
        .patch(`${route}/1`)
        .set("Cookie", user2Cookie)
        .send({ name: newName })

      expect(response.statusCode).toEqual(403)
    })

    it("should return 403 trying to delete an envelope", async () => {
      const response = await supertest(app)
        .delete(`${route}/1`)
        .set("Cookie", user2Cookie)

      expect(response.statusCode).toEqual(403)
    })
  })
})
