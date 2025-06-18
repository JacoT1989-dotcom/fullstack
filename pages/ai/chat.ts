// pages/api/ai/chat.ts
import { NextApiRequest, NextApiResponse } from "next";
import { validateRequest } from "@/auth";
import { ClaudeEcommerceAgent } from "@/lib/ai/claude-service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const aiAgent = new ClaudeEcommerceAgent(prisma);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get session info (using your Lucia setup)
    const { user, session } = await validateRequest();

    const { message, conversationId, context = {} } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Build context with user data
    const ecommerceContext = {
      userId: user?.id,
      sessionId:
        session?.id || (req.headers["x-session-id"] as string) || "anonymous",
      currentPage: context.currentPage,
      userTier: user?.tier,
      ...context,
    };

    // Optionally fetch user's recent orders and cart with correct schema
    if (user) {
      const [recentOrders, userCart] = await Promise.all([
        // Fetch recent orders using your Order model
        prisma.order.findMany({
          where: { userId: user.id },
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            orderItems: {
              include: {
                variation: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        }),
        // Fetch user's cart using your Cart/CartItem schema
        prisma.cart.findUnique({
          where: { userId: user.id },
          include: {
            cartItems: {
              include: {
                variation: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        }),
      ]);

      ecommerceContext.userOrders = recentOrders;
      ecommerceContext.cartItems = userCart?.cartItems || [];
    }

    const result = await aiAgent.sendMessage(
      message,
      ecommerceContext,
      conversationId,
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("AI Chat API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
