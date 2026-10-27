
import express from "express";
import rateLimit from "express-rate-limit";

import authMiddleware from "../middleware/authMiddleware.js";
import { mcpChat } from "../controllers/mcpChatController.js";

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

router.use(authMiddleware);
router.use(chatLimiter);

router.post("/", mcpChat);

export default router;
