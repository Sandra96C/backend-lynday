import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../app.js";
import User from "../../models/User.js";
import Product from "../../models/Product.js";
import ProductCategory from "../../models/ProductCategory.js";
import Category from "../../models/Category.js";
import GiftBox from "../../models/GiftBox.js";
import Order from "../../models/Order.js";

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

export const createTestProductCategories = async () => {
  await ProductCategory.deleteMany({});

  await ProductCategory.create({
    name: "alimentación",
    description: "Productos de degustación y alimentación artesanal",
    sort: 1,
  });

  await ProductCategory.create({
    name: "decoración",
    description: "Productos decorativos para el hogar",
    sort: 2,
  });
};

export const createTestCategories = async () => {
  await Category.deleteMany({});

  await Category.create({
    name: "día de la madre",
    description: "Cajas regalo especiales para el día de la madre",
    slug: "dia-de-la-madre",
    active: true,
    sort: 1,
  });

  await Category.create({
    name: "cumpleaños",
    description: "Cajas regalo para celebrar cumpleaños",
    slug: "cumpleanos",
    active: true,
    sort: 2,
  });
};

export const createTestBoxes = async () => {
  await createTestCategories();
  await createTestProducts();

  const product = await Product.findOne();
  const category = await Category.findOne();

  await GiftBox.deleteMany({});

  await GiftBox.create({
    name: "caja básica día de la madre",
    type: "fixed",
    slug: "caja-basica",
    level: "basic",
    basePrice: 19.99,
    category: category._id,
    products: [{ product: product._id, quantity: 1 }],
    active: true,
  });

  await GiftBox.create({
    name: "caja premium cumpleaños",
    type: "custom",
    slug: "caja-premium",
    level: "premium",
    basePrice: 59.99,
    category: category._id,
    products: [{ product: product._id, quantity: 2 }],
    active: true,
  });
};

export const createTestOrders = async () => {
  await createTestBoxes();
  await Order.deleteMany({});

  const box = await GiftBox.findOne();

  await Order.create({
    orderNumber: "0001",
    customer: {
      name: "test",
      email: "test@test.com",
      phone: "612345678",
    },
    giftBoxes: [
      {
        giftBox: box._id,
        name: box.name,
        price: box.basePrice,
        quantity: 1,
        level: box.level,
        products: box.products,
      },
    ],
    totalPrice: box.basePrice,
    orderStatus: "draft",
  });

  await Order.create({
    orderNumber: "0002",
    customer: {
      name: "test2",
      email: "test2@test.com",
      phone: "612315678",
    },
    giftBoxes: [
      {
        giftBox: box._id,
        name: box.name,
        price: box.basePrice,
        quantity: 1,
        level: box.level,
        products: box.products,
      },
    ],
    totalPrice: box.basePrice,
    orderStatus: "pending",
  });
};
