// index.j
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Project, User, Onboarding, Wishlist } from "./models/index.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoute.js";
import calculateRoutes from "./routes/calculateRoute.js";
import newsRoutes from "./routes/newsRoute.js";
import wishlistRoutes from "./routes/wishlistRoute.js";
import marketRoutes from "./routes/marketRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/calculate", calculateRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/market", marketRoutes);
app.get("/test", async (req, res) => {
  try {
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});