import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    location: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    jobUrl: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Interview",
        "Offer",
        "Rejected",
        "Wishlist",
      ],
      default: "Applied",
    },

    appliedDate: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ user: 1, createdAt: -1 });

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;