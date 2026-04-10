const express = require("express");
const cors    = require("cors");

const routes = require("./routes");

const app = express();

// CORS - allow admin panel origin
app.use(cors({
  origin: [
    "http://localhost:5173",  // Vite dev server
    "http://localhost:3000",  // Alternative dev port
    "http://localhost:4173",  // Vite preview
    process.env.ADMIN_ORIGIN || "*"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));
app.get("/",       (req, res) => res.send("Palify API running 🚀"));

app.use("/api", routes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
