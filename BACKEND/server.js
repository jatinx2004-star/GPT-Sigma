import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chat.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// API routes
app.use("/api", chatRoutes);

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// SPA fallback using pure middleware (bypasses path-to-regexp entirely)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

const connectDB = async () => {
   try {
     await mongoose.connect(process.env.MONGO_ATLAS_URL);
     console.log("connected with Database");
   } catch (err) {
     console.log("Failed to connect with Db", err);
   }
};