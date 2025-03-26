import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/user", userRoutes);

export default app;
