
import express from "express";
import rateLimit from "express-rate-limit";

import authMiddleware from "../middleware/authMiddleware.js";
import {
  listApplicationsForUser,
  getApplicationStatsForUser,
  generateInterviewPrepForUser,
} from "../services/applicationTools.js";
import { interviewRequestSchema } from "../utils/aiValidators.js";

const router = express.Router();

const toolLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

router.use(authMiddleware);
router.use(toolLimiter);

router.get("/applications", async (req, res) => {
  try {
    const applications = await listApplicationsForUser(
      req.user._id,
      {
        status: req.query.status,
        search: req.query.search,
      }
    );

    res.json({ applications });
  } catch (error) {
    console.error("MCP web list tool failed:", error.message);
    res.status(500).json({ message: "Unable to list applications" });
  }
});

router.get("/application-stats", async (req, res) => {
  try {
    const stats = await getApplicationStatsForUser(req.user._id);
    res.json({ stats });
  } catch (error) {
    console.error("MCP web stats tool failed:", error.message);
    res.status(500).json({ message: "Unable to get application stats" });
  }
});

router.post("/interview-questions", async (req, res) => {
  const parsed = interviewRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Please provide a valid resume, job description, and difficulty.",
      errors: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  try {
    const interviewPrep = await generateInterviewPrepForUser(parsed.data);
    res.json({ interviewPrep });
  } catch (error) {
    console.error("MCP web interview tool failed:", error.message);
    res.status(502).json({
      message: "Unable to generate interview questions right now.",
    });
  }
});

export default router;
