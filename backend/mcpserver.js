
import "dotenv/config";
import mongoose from "mongoose";
import * as z from "zod/v4";
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import {
  listApplicationsForUser,
  getApplicationStatsForUser,
  generateInterviewPrepForUser,
} from "./services/applicationTools.js";

const userId = process.env.CAREERPILOT_USER_ID;

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing from backend/.env");
}

if (!userId || !mongoose.isValidObjectId(userId)) {
  throw new Error(
    "Set CAREERPILOT_USER_ID to your own CareerPilot user ID in backend/.env"
  );
}

await mongoose.connect(process.env.MONGO_URI);

serveStdio(() => {
  const server = new McpServer({
    name: "careerpilot",
    version: "1.0.0",
  });

  server.registerTool(
    "list_applications",
    {
      description:
        "List the configured CareerPilot user's job applications. Optionally filter by status or search term.",
      inputSchema: z.object({
        status: z
          .enum(["Wishlist", "Applied", "Interview", "Offer", "Rejected"])
          .optional(),
        search: z.string().max(100).optional(),
      }),
    },
    async ({ status, search }) => {
      const applications = await listApplicationsForUser(userId, {
        status,
        search,
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(applications, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "get_application_stats",
    {
      description:
        "Get total job applications and counts by status for the configured CareerPilot user.",
      inputSchema: z.object({}),
    },
    async () => {
      const stats = await getApplicationStatsForUser(userId);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(stats, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "generate_interview_questions",
    {
      description:
        "Generate interview questions from a resume and job description using CareerPilot's Gemini service.",
      inputSchema: z.object({
        resumeText: z.string().min(50).max(15000),
        jobDescription: z.string().min(50).max(15000),
        difficulty: z
          .enum(["Beginner", "Intermediate", "Advanced"])
          .default("Intermediate"),
      }),
    },
    async (input) => {
      const prep = await generateInterviewPrepForUser(input);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(prep, null, 2),
          },
        ],
      };
    }
  );

  return server;
});
