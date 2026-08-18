import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import { ConnectToDB } from "./src/config/db.js";
import finalApplicationRoutes from "./src/routes/FinalApplication.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use(
  "/api/applications",
  finalApplicationRoutes
);

// Health Check
app.get("/", (req, res) => {
  res.send("Loan Processing AI API Running");
});

// Database Connection
ConnectToDB();

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
