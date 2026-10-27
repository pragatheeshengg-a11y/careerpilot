
import { z } from "zod";
import { chatWithMcpTools } from "../services/mcpGeminiService.js";

const chatSchema = z.object({
  message: z.string().trim().min(1).max(4000),
});

export async function mcpChat(req, res) {
  const parsed = chatSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Enter a message of up to 4000 characters.",
    });
  }

  try {
    const reply = await chatWithMcpTools(
      parsed.data.message,
      req.user._id
    );

    return res.json({ reply });
  } catch (error) {
    console.error("CareerPilot MCP chat failed:", error.message);

    return res.status(502).json({
      message:
        "CareerPilot AI is temporarily unavailable. Please try again.",
    });
  }
}
