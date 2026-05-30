import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import GiftBox from "../models/GiftBox.js";
import {
  createTestBoxes,
  createTestUsers,
  getTestUserData,
} from "./helpers/testUtils.js";

describe("GiftBox ", function () {
  beforeEach(async () => {
    await createTestBoxes();
  });

  describe("GET GiftBoxes", function () {
    it("Deberia retornar un array de cajas regalo", async function () {
      const res = await request(app).get(`/box`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("Deberia retornar la caja con el id", async function () {
      const giftBox = await GiftBox.findOne();

      const res = await request(app).get(`/box/${giftBox._id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name");
    });
  });

  describe("Put GiftBox", function () {
    let adminUser = "";
    let user = "";

    beforeEach(async () => {
      await createTestUsers();
      user = await getTestUserData("test@test.com");
    });

    it("Edita gift box name", async () => {
      const giftBox = await GiftBox.findOne();
      giftBox.name = "Lola";

      const res = await request(app)
        .put(`/box/${giftBox._id}`)
        .set("Authorization", `Bearer ${user.token}`)
        .send({ name: giftBox.name });

      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal("Lola");
    });

    it("No edita la caja sin token", async () => {
      const giftBox = await GiftBox.findOne();
      giftBox.name = "Maria";
      const res = await request(app)
        .put(`/box/${giftBox._id}`)
        .send({ name: giftBox.name });

      expect(res.status).to.equal(401);
    });
  });

  describe("Delete Caja", function () {
    let adminUser = "";
    let user = "";

    beforeEach(async () => {
      await createTestUsers();
      adminUser = await getTestUserData("admin@test.com");
      user = await getTestUserData("test@test.com");
    });

    it("No Elimina caja si no es admin", async () => {
      const giftBox = await GiftBox.findOne();
      const res = await request(app)
        .delete(`/box/${giftBox._id}`)
        .set("Authorization", `Bearer ${user.token}`);

      expect(res.status).to.equal(403);
    });

    it("Elimina caja si es admin", async () => {
      const giftBox = await GiftBox.findOne();
      const res = await request(app)
        .delete(`/box/${giftBox._id}`)
        .set("Authorization", `Bearer ${adminUser.token}`);

      expect(res.status).to.equal(204);
    });
  });
});
