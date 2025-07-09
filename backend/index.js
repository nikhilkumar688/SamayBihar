import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
dotenv.config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
//for allowing json object in request body
app.use(express.json());
app.listen(5000, () => {
  console.log("Server is running on port 5000 ...");
});
app.use("/api/auth", authRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
