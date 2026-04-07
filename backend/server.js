import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

/* CORS */
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

/* Routes */
app.use("/api", authRoutes);

/* Home test route */
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

/* MongoDB connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

/* Start server */
app.listen(process.env.PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${process.env.PORT}`);
});
