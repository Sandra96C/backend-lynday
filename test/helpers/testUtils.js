import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../app.js";
import User from "../../models/User.js";

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
