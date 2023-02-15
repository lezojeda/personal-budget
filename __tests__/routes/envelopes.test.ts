import { Server } from "http"
import supertest from "supertest"
import createApp from "../../createApp"
import { MESSAGES } from "../../src/constants/messages"
import { getPool } from "../../src/db"

describe("Envelopes", () => {
  let app = createApp()
  let server: Server
  let cookie: string

  const route = "/envelopes"
  const testEnvelope = {
    current_amount: 500,
    envelope_limit: 600,
    name: "Gas",
  }

  beforeAll(async () => {
    server = app.listen()
  })

  afterAll(() => {
    server.close()
    getPool().end()
  })

  describe("User trying to access their own envelopes", () => {
    beforeAll(async () => {
      const signInResponse = await supertest(app)
        .post("/auth/signin")
        .send({ username: "test", password: "password" })
      cookie = signInResponse.headers["set-cookie"]
    })

    afterAll(async () => {
      await supertest(app).post("/auth/signout")
    })

    describe("GET", () => {
      it("should return 200 getting an envelope", async () => {
        const response = await supertest(app)
          .get(`${route}/1`)
          .set("Cookie", cookie)

        expect(response.statusCode).toEqual(200)
      })

      it("should return 200 getting user envelopes", async () => {
        const response = await supertest(app).get(route).set("Cookie", cookie)

        expect(response.statusCode).toEqual(200)
        expect(response.body.length).toEqual(10)
      })

      it("should return 404 getting an envelope that does not exist", async () => {
        const response = await supertest(app)
          .get(`${route}/1500`)
          .set("Cookie", cookie)

        expect(response.statusCode).toEqual(404)
      })
    })

    it("should return 201 and the id after creating an envelope", async () => {
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

    describe("PATCH", () => {
      it("should return 200 and the updated envelope when updating", async () => {
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

    describe("GET", () => {
      it("should return 204 deleting an envelope", async () => {
        const response = await supertest(app)
          .delete(`${route}/11`)
          .set("Cookie", cookie)

        expect(response.statusCode).toEqual(204)
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

    it("should return 403 trying to get an evelope", async () => {
      const response = await supertest(app)
        .get(`${route}/1`)
        .set("Cookie", user2Cookie)

      expect(response.statusCode).toEqual(403)
    })

    it("should return 403 trying to update an evelope", async () => {
      const newName = "groceries"
      const response = await supertest(app)
        .patch(`${route}/1`)
        .set("Cookie", user2Cookie)
        .send({ name: newName })

      expect(response.statusCode).toEqual(403)
    })

    it("should return 403 trying to delete an evelope", async () => {
      const newName = "groceries"
      const response = await supertest(app)
        .delete(`${route}/1`)
        .set("Cookie", user2Cookie)
        .send({ name: newName })

      expect(response.statusCode).toEqual(403)
    })
  })
})
