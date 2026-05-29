import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

describe("Auth User", function () {
  // Register test

  it("Deberia de registrar un usuario y poner role user si no se especifica", async function () {
    const adminUser = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "123456",
    });

    const token = adminUser.body.token;
    const res = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "newUser",
        email: "newUser@test.com",
        password: "123456",
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("role", "user");
  });

  it("Deberia retornar 401 si no hay nadie logueado", async function () {
    const res = await request(app).post("/auth/register").send({
      email: "newUser@test.com",
      password: "123456",
    });

    expect(res.status).to.equal(401);
  });

  it("Deberia retornar 403 si no es admin el que registra", async function () {
    const user = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "123456",
    });

    const token = user.body.token;
    const res = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "newUser@test.com",
        password: "123456",
      });

    expect(res.status).to.equal(403);
  });

  it("Deberia retornar 400 si faltan name, email o password en register", async function () {
    const adminUser = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "123456",
    });

    const token = adminUser.body.token;
    const res = await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "newUser@test.com",
        password: "123456",
      });

    expect(res.status).to.equal(400);
  });

  it("Debería retornar 400 si el usuario ya existe en register", async function () {
    const adminUser = await request(app).post("/auth/login").send({
      email: "admin@example.com",
      password: "123456",
    });

    const token = adminUser.body.token;
    const res = await await request(app)
      .post("/auth/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "test@test.com",
        password: "123456",
      });

    expect(res.status).to.equal(400);
  });

  // Login test
  it("Deberia retornar 201, un token y el usuario al loguear", async function () {
    const res = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("token");
    expect(res.body).to.have.property("user");
  });
});
