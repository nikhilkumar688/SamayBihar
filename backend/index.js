// server.js or index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // ✅ IMPORT CORS

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

dotenv.config();

const app = express();

// ✅ CORS Configuration — allow your Vercel frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://sb-xi-jet.vercel.app", // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ JSON & cookies
app.use(express.json());
app.use(cookieParser());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Connect to DB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database is connected");

    // Only start server after DB connects
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
