import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import leadRoutes from "./routes/leadRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Mini CRM Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

// 🔥 START SERVER FIRST
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 🔥 THEN CONNECT TO MONGO
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB Error ❌", err));