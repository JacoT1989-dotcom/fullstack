// pages/api/ai/conversations.ts
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
    const { user, session } = await validateRequest();
    const sessionId =
      session?.id || (req.headers["x-session-id"] as string) || "anonymous";

    const conversations = await aiAgent.getUserConversations(
      user?.id || "",
      sessionId,
    );

    res.status(200).json({ conversations });
  } catch (error) {
    console.error("Get Conversations Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
