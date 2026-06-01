import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import Category from "../models/Category.js";

import {
  createTestCategories,
  createTestUsers,
  getTestUserData,
} from "./helpers/testUtils.js";

describe("Category ", function () {
  beforeEach(async () => {
    await createTestCategories();
  });

  describe("GET Categories", function () {
    it("Deberia retornar un array de categories", async function () {
      const res = await request(app).get(`/category`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("Deberia retornar la categoria con el id", async function () {
      const category = await Category.findOne();

      const res = await request(app).get(`/category/${category._id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name");
    });
  });

  describe("Put  Category", function () {
    let user = "";

    beforeEach(async () => {
      await createTestUsers();
      user = await getTestUserData("test@test.com");
    });

    it("Edita category name", async () => {
      const category = await Category.findOne();
      category.name = "Lola";

      const res = await request(app)
        .put(`/category/${category._id}`)
        .set("Authorization", `Bearer ${user.token}`)
        .send({ name: category.name });

      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal("Lola");
    });

    it("No edita category sin token", async () => {
      const category = await Category.findOne();
      const res = await request(app)
        .put(`/category/${category._id}`)
        .send(category);

      expect(res.status).to.equal(401);
    });
  });

  describe("Delete Category", function () {
    let user = "";

    beforeEach(async () => {
      await createTestUsers();
      user = await getTestUserData("test@test.com");
    });

    it("Elimina category", async () => {
      const category = await Category.findOne();
      const res = await request(app)
        .delete(`/category/${category.id}`)
        .set("Authorization", `Bearer ${user.token}`);

      expect(res.status).to.equal(204);
    });
  });

  describe("Create Category", function () {
    let user = "";
    beforeEach(async () => {
      await createTestUsers();
      user = await getTestUserData("test@test.com");
    });

    it("Crea una nueva category", async () => {
      const res = await request(app)
        .post(`/category/new`)
        .set("Authorization", `Bearer ${user.token}`)
        .send({ name: "New Category" });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("name", "new category");
      expect(res.body).to.have.property("slug", "new-category");
    });

    it("No crea una nueva category que ya existe", async () => {
      const res = await request(app)
        .post(`/category/new`)
        .set("Authorization", `Bearer ${user.token}`)
        .send({ name: "dia de la madre" });

      expect(res.status).to.equal(409);
    });
  });
});
