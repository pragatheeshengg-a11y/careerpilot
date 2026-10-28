import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  listApplicationsForUser,
  getApplicationStatsForUser,
} from "../services/applicationTools.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/applications", async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const applications = await listApplicationsForUser(userId, {
      status: req.query.status,
      search: req.query.search,
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const stats = await getApplicationStatsForUser(userId);

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch application statistics",
    });
  }
});

export default router;