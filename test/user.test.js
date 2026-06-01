import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createTestUsers, getTestUserData } from "./helpers/testUtils.js";

describe("Users ", function () {
  describe("GET Users", function () {
    let adminUser = "";
    let user = "";
    beforeEach(async () => {
      await createTestUsers();
      adminUser = await getTestUserData("admin@test.com");
      user = await getTestUserData("test@test.com");
    });

    it("Deberia retornar un array de users", async function () {
      const res = await request(app)
        .get(`/user`)
        .set("Authorization", `Bearer ${user.token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("Deberia retornar el user con el id", async function () {
      const res = await request(app)
        .get(`/user/${adminUser.user.id}`)
        .set("Authorization", `Bearer ${adminUser.token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name");
    });

    it("Deberia retornar 401 si no hay token", async function () {
      const res = await request(app).get("/user");
      expect(res.status).to.equal(401);
    });
  });

  describe("Put Users", function () {
    let adminUser = "";
    let user = "";

    beforeEach(async () => {
      await createTestUsers();
      adminUser = await getTestUserData("admin@test.com");
      user = await getTestUserData("test@test.com");
    });

    it("Edita user name", async () => {
      const userEdit = user.user;

      userEdit.name = "Lola";

      const res = await request(app)
        .put(`/user/${userEdit.id}`)
        .set("Authorization", `Bearer ${adminUser.token}`)
        .send(userEdit);

      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal("Lola");
    });

    it("No edita sin token", async () => {
      const userEdit = user.user;

      userEdit.name = "Lola";

      const res = await request(app)
        .put(`/user/${userEdit.id}`)
        .send({ name: userEdit.name });

      expect(res.status).to.equal(401);
    });
  });

  describe("Delete Users", function () {
    let adminUser = "";
    let user = "";

    beforeEach(async () => {
      await createTestUsers();
      adminUser = await getTestUserData("admin@test.com");
      user = await getTestUserData("test@test.com");
    });

    it("No Elimina user si no es admin", async () => {
      const res = await request(app)
        .delete(`/user/${user.user.id}`)
        .set("Authorization", `Bearer ${user.token}`);

      expect(res.status).to.equal(403);
    });

    it("Elimina user si es admin", async () => {
      const res = await request(app)
        .delete(`/user/${user.user.id}`)
        .set("Authorization", `Bearer ${adminUser.token}`);

      expect(res.status).to.equal(204);
    });
  });
});
