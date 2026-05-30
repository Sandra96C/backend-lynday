import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import ProductCategory from "../models/ProductCategory.js";

import {
  createTestProductCategories,
  createTestUsers,
  getTestUserData,
} from "./helpers/testUtils.js";

describe("Products Category ", function () {
  beforeEach(async () => {
    await createTestProductCategories();
  });

  describe("GET Categories", function () {
    it("Deberia retornar un array de categories", async function () {
      const res = await request(app).get(`/product-category`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("Deberia retornar la categoria con el id", async function () {
      const productCategory = await ProductCategory.findOne();

      const res = await request(app).get(
        `/product-category/${productCategory._id}`,
      );

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name");
    });
  });

  describe("Put Product Category", function () {
    let user = "";

    beforeEach(async () => {
      await createTestUsers();
      user = await getTestUserData("test@test.com");
    });

    it("Edita product category name", async () => {
      const productCategory = await ProductCategory.findOne();
      productCategory.name = "Lola";

      const res = await request(app)
        .put(`/product-category/${productCategory._id}`)
        .set("Authorization", `Bearer ${user.token}`)
        .send({ name: productCategory.name });

      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal("Lola");
    });

    it("No edita product category sin token", async () => {
      const productCategory = await ProductCategory.findOne();
      const res = await request(app)
        .put(`/product-category/${productCategory._id}`)
        .send(productCategory);

      expect(res.status).to.equal(401);
    });
  });

  describe("Delete Product Category", function () {
    let user = "";

    beforeEach(async () => {
      await createTestUsers();
      user = await getTestUserData("test@test.com");
    });

    it("Elimina product category", async () => {
      const productCategory = await ProductCategory.findOne();
      const res = await request(app)
        .delete(`/product-category/${productCategory.id}`)
        .set("Authorization", `Bearer ${user.token}`);

      expect(res.status).to.equal(204);
    });
  });
});
