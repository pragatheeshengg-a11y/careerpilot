import { z } from "zod";

export const matchRequestSchema = z.object({
  resumeText: z.string().trim().min(50).max(15000),
  jobDescription: z.string().trim().min(50).max(15000),
});

export const interviewRequestSchema = z.object({
  resumeText: z.string().trim().min(50).max(15000),
  jobDescription: z.string().trim().min(50).max(15000),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Intermediate"),
});

export const matchResponseSchema = z.object({
  matchScore: z.number().min(0).max(100),
  summary: z.string().min(1).max(2000),
  strengths: z.array(z.string().max(300)).max(10),
  missingSkills: z.array(z.string().max(300)).max(10),
  recommendations: z.array(z.string().max(500)).max(10),
});

export const interviewResponseSchema = z.object({
  roleSummary: z.string().min(1).max(1500),
  questions: z.array(
    z.object({
      question: z.string().min(1).max(500),
      category: z.enum(["Technical", "Behavioral", "Situational"]),
      difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
      whyAsked: z.string().min(1).max(500),
      answerTips: z.array(z.string().max(300)).max(5),
    })
  ).min(1).max(12),
});