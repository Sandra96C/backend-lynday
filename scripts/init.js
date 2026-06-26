import User from "../models/User.js";
import bcrypt from "bcryptjs";
import "../db.js";
import mongoose from "mongoose";

const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      const hash = await bcrypt.hash(process.env.ADMIN_USER_PASSWORD, 10);
      const adminUser = new User({
        name: "admin",
        email: process.env.ADMIN_USER_EMAIL,
        password: hash,
        role: "admin",
      });
      await adminUser.save();
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

createAdminUser();
