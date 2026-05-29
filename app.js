import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import "./db.js";
import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.router.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
