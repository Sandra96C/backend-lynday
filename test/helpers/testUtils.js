import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../app.js";
import User from "../../models/User.js";
import Product from "../../models/Product.js";

export const createTestUsers = async () => {
  await User.deleteMany({});
  const hash = await bcrypt.hash("123456", 10);

  // Usuario normal para login tests
  await User.create({
    name: "test",
    email: "test@test.com",
    password: hash,
  });

  // Usuario normal desactivado para login tests
  await User.create({
    name: "test",
    email: "test2@test.com",
    password: hash,
    active: false,
  });

  // Admin para register tests
  await User.create({
    name: "admin",
    email: "admin@test.com",
    password: hash,
    role: "admin",
  });
};

export const getTestUserData = async (userEmail, field = "") => {
  const res = await request(app).post("/auth/login").send({
    email: userEmail,
    password: "123456",
  });

  if (field) {
    return res.body[field];
  }
  return res.body;
};

export const createTestProducts = async () => {
  await Product.deleteMany({});

  await Product.create({
    name: "tarjeta personalizada",
    description: "Tarjeta de felicitación personalizada",
    slug: "tarjeta-personalizada",
    price: 2.99,
    stock: 100,
    level: "basic",
    active: true,
  });

  await Product.create({
    name: "vela aromática",
    description: "Vela aromática de lavanda 200g",
    slug: "vela-aromatica-lavanda",
    price: 12.99,
    stock: 50,
    level: "medium",
    active: true,
  });

  await Product.create({
    name: "cesta de productos gourmet",
    description: "Selección de productos gourmet artesanales",
    slug: "cesta-productos-gourmet",
    price: 49.99,
    stock: 20,
    level: "premium",
    active: true,
  });
};
