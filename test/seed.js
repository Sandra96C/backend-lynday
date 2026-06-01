import bcrypt from "bcryptjs";
import User from "../models/User.js";
import "../db.js";

export async function seedDatabase() {
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
    email: "admin@example.com",
    password: hash,
    role: "admin",
  });
}
