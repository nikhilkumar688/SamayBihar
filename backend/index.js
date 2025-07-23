import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

dotenv.config();

const app = express();

// ✅ Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://samaybihar.vercel.app",
];

// ✅ Apply CORS config
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, curl)
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allow cookies to be sent
  })
);

// ✅ Middlewares
app.use(express.json()); // to parse JSON bodies
app.use(cookieParser()); // to parse cookies

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("❌ Error:", message);
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ MongoDB Connection & Server Start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });
