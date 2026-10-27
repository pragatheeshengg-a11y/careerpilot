import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import aiRoutes from "./routes/aiRoutes.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import mcpWebRoutes from "./routes/mcpWebRoutes.js";
import mcpChatRoutes from "./routes/mcpChatRoutes.js";
import careerPilotToolsRoutes from "./routes/careerPilotToolsRoutes.js";


const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must contain at least 32 characters.");
  process.exit(1);
}

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    message: "CareerPilot API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CareerPilot backend is healthy",
  });
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/mcp-tools", mcpWebRoutes);
app.use("/api/mcp-chat", mcpChatRoutes);
app.use("/api/careerpilot-tools", careerPilotToolsRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`CareerPilot API running on http://localhost:${PORT}`);
  });
};

startServer();