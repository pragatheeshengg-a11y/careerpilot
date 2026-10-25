import express from "express";
import rateLimit from "express-rate-limit";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  analyzeJobMatch,
  generateInterviewQuestions,
} from "../controllers/aiController.js";

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "AI request limit reached. Please try again later.",
  },
});

router.use(authMiddleware);
router.use(aiLimiter);

router.post("/analyze-match", analyzeJobMatch);
router.post("/interview-questions", generateInterviewQuestions);

export default router;