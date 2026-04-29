const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

const scanController = require("./controllers/scanController");
const authController = require("./controllers/authController");

// Configure CORS for both development and production
const allowedOrigins = [
  "http://localhost:5173",  // Local Vite dev server
  "http://localhost:3000",  // Alternative local port
  process.env.FRONTEND_URL  // Production Vercel URL (from .env)
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Cyber Attack Visualizer Backend Running", port: PORT, time: new Date() });
});

// Main Routes
app.post("/api/auth/register", authController.register);
app.post("/api/auth/login", authController.login);
app.post("/api/scan", scanController.performScan);
app.get("/api/attacks", scanController.getAllAttacks);
app.get("/api/attacks/search", scanController.searchAttacks);
app.delete("/api/attacks/:id", scanController.deleteAttack);

// Live Feed & Cache Routes
app.get("/api/enrich/:ip", scanController.enrichIp);
app.get("/api/global-threats", scanController.getGlobalThreats);

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Cyber Backend running at http://localhost:${PORT}`);
});
