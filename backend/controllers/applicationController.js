import mongoose from "mongoose";
import Application from "../models/Application.js";
import {
  createApplicationSchema,
  updateApplicationSchema,
} from "../utils/applicationValidators.js";

const validStatuses = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "Wishlist",
];

function isValidId(id) {
  return mongoose.isValidObjectId(id);
}

// POST /api/applications
export const createApplication = async (req, res) => {
  try {
    const result = createApplicationSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0].message,
      });
    }

    const application = await Application.create({
      ...result.data,
      user: req.user._id,
    });

    return res.status(201).json({
      message: "Application created successfully",
      application,
    });
  } catch (error) {
    console.error("Create application error:", error.message);

    return res.status(500).json({
      message: "Unable to create application",
    });
  }
};

// GET /api/applications
export const getApplications = async (req, res) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim().slice(0, 100)
        : "";

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : "";

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status",
      });
    }

    const filter = {
      user: req.user._id,
    };

    if (status) {
      filter.status = status;
    }

    if (search) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.$or = [
        { company: { $regex: escapedSearch, $options: "i" } },
        { jobTitle: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return res.status(200).json({
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get applications error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve applications",
    });
  }
};

// GET /api/applications/:id
export const getApplicationById = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    return res.status(200).json({ application });
  } catch (error) {
    console.error("Get application error:", error.message);

    return res.status(500).json({
      message: "Unable to retrieve application",
    });
  }
};

// PUT /api/applications/:id
export const updateApplication = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const result = updateApplicationSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0].message,
      });
    }

    const application = await Application.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      { $set: result.data },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    return res.status(200).json({
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    console.error("Update application error:", error.message);

    return res.status(500).json({
      message: "Unable to update application",
    });
  }
};

// DELETE /api/applications/:id
export const deleteApplication = async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid application ID",
      });
    }

    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    return res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error.message);

    return res.status(500).json({
      message: "Unable to delete application",
    });
  }
};