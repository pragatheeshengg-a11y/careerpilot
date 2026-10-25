import { z } from "zod";

const optionalText = (maxLength) =>
  z.string().trim().max(maxLength).optional();

const jobUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => {
      if (value === "") return true;

      try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    "Job URL must be a valid HTTP or HTTPS URL"
  );

export const createApplicationSchema = z.object({
  company: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(100),

  jobTitle: z
    .string()
    .trim()
    .min(1, "Job title is required")
    .max(120),

  location: optionalText(120),
  jobUrl: jobUrlSchema.optional(),

  status: z
    .enum(["Applied", "Interview", "Offer", "Rejected", "Wishlist"])
    .optional(),

  appliedDate: z
    .string()
    .date()
    .optional(),

  notes: optionalText(3000),
});

export const updateApplicationSchema = createApplicationSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Provide at least one field to update"
  );