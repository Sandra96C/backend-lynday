import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import "./db.js";
import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.router.js";
import productRouter from "./routes/product.router.js";
import productCategoryRouter from "./routes/productCategory.router.js";
import categoryRouter from "./routes/category.router.js";
import giftBoxRouter from "./routes/giftBox.router.js";
import orderRouter from "./routes/order.router.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/product-category", productCategoryRouter);
app.use("/category", categoryRouter);
app.use("/box", giftBoxRouter);
app.use("/order", orderRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
