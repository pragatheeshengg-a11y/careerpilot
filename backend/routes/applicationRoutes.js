import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .post(createApplication)
  .get(getApplications);

router
  .route("/:id")
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

export default router;