import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createTestUsers, getTestUserData } from "./helpers/testUtils.js";

describe("Auth User", function () {
  describe("Register", function () {
    let adminToken = "";
    let token = "";

    beforeEach(async () => {
      await createTestUsers();
      adminToken = await getTestUserData("admin@test.com", "token");
      token = await getTestUserData("test@test.com", "token");
    });

    it("Deberia de registrar un usuario y poner role user si no se especifica", async function () {
      const res = await request(app)
        .post("/auth/register")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "newUser",
          email: "newUser@test.com",
          password: "123456",
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("role", "user");
    });

    it("Deberia retornar 400 si faltan name, email o password en register", async function () {
      const res = await request(app)
        .post("/auth/register")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          email: "newUser@test.com",
          password: "123456",
        });

      expect(res.status).to.equal(400);
    });

    it("Debería retornar 409 si el usuario ya existe en register", async function () {
      const res = await await request(app)
        .post("/auth/register")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "test",
          email: "test@test.com",
          password: "123456",
        });

      expect(res.status).to.equal(409);
    });

    it("Deberia retornar 401 si no hay nadie logueado", async function () {
      const res = await request(app).post("/auth/register").send({
        email: "newUser@test.com",
        password: "123456",
      });

      expect(res.status).to.equal(401);
    });

    it("Deberia retornar 403 si no es admin el que registra", async function () {
      const res = await request(app)
        .post("/auth/register")
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: "newUser@test.com",
          password: "123456",
        });

      expect(res.status).to.equal(403);
    });
  });

  describe("Login", function () {
    beforeEach(async () => {
      await createTestUsers();
    });

    it("Deberia retornar 201, un token y el usuario al loguear", async function () {
      const res = await request(app).post("/auth/login").send({
        email: "test@test.com",
        password: "123456",
      });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("token");
      expect(res.body).to.have.property("user");
    });

    it("Deberia retornar 401 si esta mal el password", async function () {
      const res = await request(app).post("/auth/login").send({
        email: "test@test.com",
        password: "133456",
      });

      expect(res.status).to.equal(401);
    });

    it("Deberia retornar 401 si no existe", async function () {
      const res = await request(app).post("/auth/login").send({
        email: "test1@test.com",
        password: "123456",
      });

      expect(res.status).to.equal(401);
    });

    it("Deberia retornar 403 si no esta activo", async function () {
      const res = await request(app).post("/auth/login").send({
        email: "test2@test.com",
        password: "123456",
      });

      expect(res.status).to.equal(403);
    });
  });
});
