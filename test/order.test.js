import { expect } from "chai";
import request from "supertest";
import app from "../app.js";
import Order from "../models/Order.js";
import GiftBox from "../models/GiftBox.js";

import {
  createTestUsers,
  getTestUserData,
  createTestOrders,
  createTestBoxes,
} from "./helpers/testUtils.js";

describe("Order ", function () {
  let user = "";
  beforeEach(async () => {
    await createTestOrders();
    await createTestUsers();
    user = await getTestUserData("test@test.com");
  });

  describe("GET Orders", function () {
    it("Deberia retornar un array de orders", async function () {
      const res = await request(app)
        .get(`/order`)
        .set("Authorization", `Bearer ${user.token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("Deberia retornar el order con el id si order.status es 'draft' sin Authorization", async function () {
      const order = await Order.findOne({ orderStatus: "draft" });

      const res = await request(app).get(`/order/${order._id}`);

      expect(res.status).to.equal(200);
    });

    it("No deberia retornar el order con el id sin autorización si order.status no es 'draft'", async function () {
      const order = await Order.findOne({ orderStatus: "pending" });

      const res = await request(app).get(`/order/${order._id}`);

      expect(res.status).to.equal(401);
    });

    it("Deberia retornar el order con el id con autorización", async function () {
      const order = await Order.findOne({ orderStatus: "pending" });

      const res = await request(app)
        .get(`/order/${order._id}`)
        .set("Authorization", `Bearer ${user.token}`);

      expect(res.status).to.equal(200);
    });
  });

  describe("PUT ORDER ", function () {
    let user = "";

    beforeEach(async () => {
      await createTestUsers();
      user = await getTestUserData("test@test.com");
    });

    it("Puedes editar un order que es draft sin estar logueado", async () => {
      const order = await Order.findOne();
      order.customer.name = "Lola";

      const res = await request(app)
        .put(`/order/${order._id}`)
        .send({ customer: order.customer });

      expect(res.status).to.equal(200);
      expect(res.body.customer.name).to.equal("Lola");
    });

    it("No puedes editar un order que no es draft si no estas logueado", async () => {
      const order = await Order.findOne({ orderStatus: "pending" });
      order.customer.name = "Lola";

      const res = await request(app)
        .put(`/order/${order._id}`)
        .send({ customer: order.customer });

      expect(res.status).to.equal(401);
    });

    it("Puedes editar un order que no es draft si estas logueado", async () => {
      const order = await Order.findOne({ orderStatus: "pending" });
      order.customer.name = "Lola";

      const res = await request(app)
        .put(`/order/${order._id}`)
        .send({ customer: order.customer })
        .set("Authorization", `Bearer ${user.token}`);

      expect(res.status).to.equal(200);
    });
  });

  describe("POST ORDER ", function () {
    beforeEach(async () => {
      await createTestBoxes();
    });

    it("Puedes crear un order", async () => {
      const giftBox = await GiftBox.findOne();
      const res = await request(app)
        .post(`/order/new`)
        .send({
          customer: {
            name: "test3",
            email: "test3@test.com",
            phone: "612345678",
          },
          giftBoxes: [
            {
              giftBox: giftBox._id,
              name: giftBox.name,
              price: giftBox.basePrice,
              quantity: 1,
              products: giftBox.products,
            },
          ],
          totalPrice: giftBox.basePrice,
          orderStatus: "draft",
        });

      expect(res.status).to.equal(201);
      expect(res.body.orderNumber).to.be.a("string");
      expect(res.body.orderNumber).to.equal("ORD-0001");

      const res2 = await request(app)
        .post(`/order/new`)
        .send({
          customer: {
            name: "test3",
            email: "test3@test.com",
            phone: "612345678",
          },
          giftBoxes: [
            {
              giftBox: giftBox._id,
              name: giftBox.name,
              price: giftBox.basePrice,
              quantity: 1,
              products: giftBox.products,
            },
          ],
          totalPrice: giftBox.basePrice,
          orderStatus: "draft",
        });

      expect(res2.status).to.equal(201);
      expect(res2.body.orderNumber).to.be.a("string");
      expect(res2.body.orderNumber).to.equal("ORD-0002");
    });
  });
});
