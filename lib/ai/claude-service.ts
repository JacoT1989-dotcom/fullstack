// lib/ai/claude-service.ts
import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface EcommerceContext {
  userId?: string;
  sessionId: string;
  userOrders?: any[];
  cartItems?: any[];
  userTier?: string;
  currentPage?: string;
}

export class ClaudeEcommerceAgent {
  constructor(private prisma: PrismaClient) {}

  async generateSystemPrompt(context: EcommerceContext): Promise<string> {
    const basePrompt = `You are an AI shopping assistant for an ecommerce platform. You help customers with:
- Product recommendations and comparisons
- Order status and tracking
- Returns and refunds
- Account management
- General shopping questions

Key guidelines:
- Be helpful, friendly, and concise
- Always prioritize customer satisfaction
- If you need to access specific order or product data, ask for clarification
- For sensitive account issues, direct users to customer service
- Keep responses focused on ecommerce-related topics

User Context:
- User Tier: ${context.userTier || "Not specified"}
- Current Page: ${context.currentPage || "Unknown"}`;

    // Add context-specific information
    let contextualPrompt = basePrompt;

    if (context.userOrders?.length) {
      const orderSummary = context.userOrders.map((order) => ({
        id: order.id,
        status: order.status,
        total: order.totalAmount,
        itemCount: order.orderItems?.length || 0,
      }));
      contextualPrompt += `\n\nRecent orders: ${JSON.stringify(orderSummary)}`;
    }

    if (context.cartItems?.length) {
      const cartSummary = context.cartItems.map((item) => ({
        product: item.variation?.product?.productName,
        variation: `${item.variation?.color} ${item.variation?.size}`,
        quantity: item.quantity,
        price: item.variation?.price,
      }));
      contextualPrompt += `\n\nCurrent cart: ${JSON.stringify(cartSummary)}`;
    }

    return contextualPrompt;
  }

  async sendMessage(
    message: string,
    context: EcommerceContext,
    conversationId?: string,
  ): Promise<{ response: string; conversationId: string }> {
    try {
      // Get or create conversation
      let conversation;
      if (conversationId) {
        conversation = await this.prisma.aiConversation.findUnique({
          where: { id: conversationId },
          include: { messages: { orderBy: { createdAt: "asc" } } },
        });
      }

      if (!conversation) {
        conversation = await this.prisma.aiConversation.create({
          data: {
            userId: context.userId,
            sessionId: context.sessionId,
            title: this.generateConversationTitle(message),
          },
          include: { messages: true },
        });
      }

      // Save user message
      await this.prisma.aiMessage.create({
        data: {
          conversationId: conversation.id,
          role: "user",
          content: message,
          metadata: {
            currentPage: context.currentPage,
            timestamp: new Date().toISOString(),
          },
        },
      });

      // Prepare messages for Claude
      const messages = [
        ...conversation.messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user" as const, content: message },
      ];

      // Get AI response
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        system: await this.generateSystemPrompt(context),
        messages: messages,
      });

      const aiResponse =
        response.content[0].type === "text"
          ? response.content[0].text
          : "I apologize, but I encountered an error processing your request.";

      // Save AI response
      await this.prisma.aiMessage.create({
        data: {
          conversationId: conversation.id,
          role: "assistant",
          content: aiResponse,
          metadata: {
            model: "claude-3-5-sonnet-20241022",
            timestamp: new Date().toISOString(),
          },
        },
      });

      return {
        response: aiResponse,
        conversationId: conversation.id,
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      throw new Error("Failed to process AI request");
    }
  }

  private generateConversationTitle(firstMessage: string): string {
    const words = firstMessage.split(" ").slice(0, 5);
    return words.join(" ") + (firstMessage.split(" ").length > 5 ? "..." : "");
  }

  async getConversationHistory(conversationId: string) {
    return await this.prisma.aiConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async getUserConversations(userId: string, sessionId: string) {
    return await this.prisma.aiConversation.findMany({
      where: {
        OR: [{ userId: userId }, { sessionId: sessionId }],
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }
}
