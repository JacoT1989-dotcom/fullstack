// pages/api/ai/conversations/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { ClaudeEcommerceAgent } from "@/lib/ai/claude-service";
import { validateRequest } from "@/auth";

const prisma = new PrismaClient();
const aiAgent = new ClaudeEcommerceAgent(prisma);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const { user, session } = await validateRequest();

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Conversation ID required" });
    }

    const conversation = await aiAgent.getConversationHistory(id);

    // Check if user has access to this conversation
    if (
      conversation &&
      conversation.userId &&
      conversation.userId !== user?.id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Get Conversation Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
