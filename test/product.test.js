import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import Product from "../models/Product.js";
import {
  createTestProducts,
  createTestUsers,
  getTestUserData,
} from "./helpers/testUtils.js";

describe("Products ", function () {
  beforeEach(async () => {
    await createTestProducts();
  });

  describe("GET Products", function () {
    it("Deberia retornar un array de products", async function () {
      const res = await request(app).get(`/product`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("Deberia retornar el producto con el id", async function () {
      const product = await Product.findOne();

      const res = await request(app).get(`/product/${product._id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name");
    });

    it("Deberia retornar el producto con el slug", async function () {
      const product = await Product.findOne();

      const res = await request(app).get(`/product/${product.slug}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("name");
    });
  });

  describe("Put Product", function () {
    let adminUser = "";
    let user = "";

    beforeEach(async () => {
      await createTestUsers();
      adminUser = await getTestUserData("admin@test.com");
      user = await getTestUserData("test@test.com");
    });

    it("Edita product name", async () => {
      const product = await Product.findOne();
      product.name = "Lola";

      const res = await request(app)
        .put(`/product/${product._id}`)
        .set("Authorization", `Bearer ${user.token}`)
        .send({ name: product.name });

      expect(res.status).to.equal(200);
      expect(res.body.name).to.equal("Lola");
    });

    it("No edita product sin token", async () => {
      const product = await Product.findOne();
      const res = await request(app)
        .put(`/product/${product._id}`)
        .send({ name: product.name });

      expect(res.status).to.equal(401);
    });
  });

  describe("Delete Product", function () {
    let adminUser = "";
    let user = "";

    beforeEach(async () => {
      await createTestUsers();
      adminUser = await getTestUserData("admin@test.com");
      user = await getTestUserData("test@test.com");
    });

    it("No Elimina product si no es admin", async () => {
      const product = await Product.findOne();
      const res = await request(app)
        .delete(`/product/${product._id}`)
        .set("Authorization", `Bearer ${user.token}`);

      expect(res.status).to.equal(403);
    });

    it("Elimina product si es admin", async () => {
      const product = await Product.findOne();
      const res = await request(app)
        .delete(`/product/${product.id}`)
        .set("Authorization", `Bearer ${adminUser.token}`);

      expect(res.status).to.equal(204);
    });
  });

  describe("Post Product", function () {
    let adminUser = "";
    let user = "";
    beforeEach(async () => {
      await createTestUsers();
      adminUser = await getTestUserData("admin@test.com");
      user = await getTestUserData("test@test.com");
    });

    it("Crea un nuevo producto", async () => {
      const newProduct = {
        name: "New Product",
        description: "This is a new product",
        price: 100,
        stock: 10,
      };

      const res = await request(app)
        .post(`/product/new`)
        .set("Authorization", `Bearer ${adminUser.token}`)
        .send(newProduct);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("slug", "new-product");
    });

    it("No crea un nuevo producto sin token", async () => {
      const newProduct = {
        name: "New Product",
        description: "This is a new product",
        price: 100,
        stock: 10,
      };
      const res = await request(app).post(`/product/new`).send(newProduct);

      expect(res.status).to.equal(401);
    });
  });
});
