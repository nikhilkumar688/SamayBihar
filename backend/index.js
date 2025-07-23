import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // ✅ CORS

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

dotenv.config();

const app = express();

// ✅ Corrected CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://samaybihar.vercel.app", // ✅ removed trailing slash
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Database connected");

    app.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
