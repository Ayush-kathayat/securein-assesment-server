import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cveRoutes from "./routes/cveRoutes.js";
import connectDB from "./config/databaseConnection.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for React frontend communication

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/cves", cveRoutes);

// Base Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
