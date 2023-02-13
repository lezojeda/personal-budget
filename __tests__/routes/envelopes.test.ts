import { Server } from "http"
import supertest from "supertest"
import createApp from "../../createApp"
import { getPool } from "../../src/db"
import { IUser } from "../../src/interfaces/User.interface"

const route = "/envelopes"

describe("Envelopes", () => {
  let app = createApp()
  let server: Server
  let cookie: string

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
    let userCreatedId: string
    beforeAll(async () => {
      const user = {
        username: "test-envelope",
        password: "password",
      }

      const signUpResponse = await supertest(app)
        .post("/auth/signup")
        .send(user)
      userCreatedId = signUpResponse.body.user.id

      const response = await supertest(app).post("/auth/signin").send(user)
      cookie = response.headers["set-cookie"]
    })

    afterAll(async () => {
      /** Create another envelope to user in not-owned envelope tests */
      await supertest(app).post(route).set("Cookie", cookie).send(testEnvelope)
      await supertest(app).post("/auth/signout")
    })

    it("should return 201 and the id after creating an envelope", async () => {
      const response = await supertest(app)
        .post(route)
        .set("Cookie", cookie)
        .send(testEnvelope)

      expect(response.statusCode).toEqual(201)
      expect(response.body).toStrictEqual({
        message: "Envelope created successfully",
        envelope: {
          id: 1,
        },
      })
    })

    describe("GET", () => {
      it("should return 200 getting an envelope", async () => {
        const response = await supertest(app)
          .get(`${route}/1`)
          .set("Cookie", cookie)

        expect(response.statusCode).toEqual(200)
      })

      it("should return 404 getting an envelope that does not exist", async () => {
        const response = await supertest(app)
          .get(`${route}/1500`)
          .set("Cookie", cookie)

        expect(response.statusCode).toEqual(404)
      })
    })

    describe("PATCH", () => {
      it("should return 200 and the updated envelope when updating", async () => {
        const newName = "groceries"
        const response = await supertest(app)
          .patch(`${route}/1`)
          .set("Cookie", cookie)
          .send({ name: newName })

        const updatedEnvelope = {
          ...testEnvelope,
          id: 1,
          current_amount: "$500.00",
          envelope_limit: "$600.00",
          name: newName,
          user_id: userCreatedId,
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
          .delete(`${route}/1`)
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
      const user2 = {
        username: "test-envelope2",
        password: "password",
      }

      await supertest(app).post("/auth/signup").send(user2)
      const response = await supertest(app).post("/auth/signin").send(user2)
      user2Cookie = response.headers["set-cookie"]
    })

    afterAll(async () => {
      await supertest(app).post("/auth/signout")
    })

    it("should return 403 trying to get an evelope", async () => {
      const response = await supertest(app)
        .get(`${route}/2`)
        .set("Cookie", user2Cookie)

      expect(response.statusCode).toEqual(403)
    })

    it("should return 403 trying to update an evelope", async () => {
      const newName = "groceries"
      const response = await supertest(app)
        .patch(`${route}/2`)
        .set("Cookie", user2Cookie)
        .send({ name: newName })

      expect(response.statusCode).toEqual(403)
    })

    it("should return 403 trying to delete an evelope", async () => {
      const newName = "groceries"
      const response = await supertest(app)
        .delete(`${route}/2`)
        .set("Cookie", user2Cookie)
        .send({ name: newName })

      expect(response.statusCode).toEqual(403)
    })
  })
})
