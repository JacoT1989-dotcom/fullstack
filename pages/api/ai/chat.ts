// pages/api/ai/chat.ts
import { NextApiRequest, NextApiResponse } from "next";
import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia } from "lucia";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const prisma = new PrismaClient();

// Create lucia instance for API routes (without React cache)
const adapter = new PrismaAdapter(prisma.session, prisma.user);
const luciaAuth = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes: any) => {
    return {
      id: attributes.id,
      username: attributes.username,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      displayName: attributes.displayName,
      email: attributes.email,
      phoneNumber: attributes.phoneNumber,
      streetAddress: attributes.streetAddress,
      suburb: attributes.suburb,
      townCity: attributes.townCity,
      postcode: attributes.postcode,
      country: attributes.country,
      avatarUrl: attributes.avatarUrl,
      backgroundUrl: attributes.backgroundUrl,
      role: attributes.role,
      tier: attributes.tier,
    };
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Handle auth for API routes
    let user = null;
    let session = null;

    try {
      const sessionId = req.cookies[luciaAuth.sessionCookieName] || null;
      if (sessionId) {
        const result = await luciaAuth.validateSession(sessionId);
        user = result.user;
        session = result.session;
      }
    } catch (authError) {
      console.log("Auth error (continuing as guest):", authError);
      // Continue as guest user
    }
    const { message, conversationId, context = {} } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Fetch real data from your database
    const [products, categories, userOrders, userCart] = await Promise.all([
      // Get recent products
      prisma.product.findMany({
        where: { isPublished: true },
        include: { Variation: true },
        take: 20,
        orderBy: { createdAt: "desc" },
      }),

      // Get unique categories
      prisma.product.findMany({
        where: { isPublished: true },
        select: { category: true },
        distinct: ["category"],
      }),

      // Get user's recent orders if logged in
      user
        ? prisma.order.findMany({
            where: { userId: user.id },
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
              orderItems: {
                include: {
                  variation: {
                    include: { product: true },
                  },
                },
              },
            },
          })
        : [],

      // Get user's cart if logged in
      user
        ? prisma.cart.findUnique({
            where: { userId: user.id },
            include: {
              cartItems: {
                include: {
                  variation: {
                    include: { product: true },
                  },
                },
              },
            },
          })
        : null,
    ]);

    // Extract unique categories
    const uniqueCategories = [
      ...new Set(categories.flatMap((p) => p.category)),
    ];

    // Prepare context for Claude
    const systemPrompt = `You are an AI shopping assistant for an ecommerce platform. You have access to real product data and can help customers with specific product information, recommendations, and shopping questions.

AVAILABLE PRODUCTS (${products.length} total):
${products
  .slice(0, 10)
  .map(
    (product) =>
      `- ${product.productName} (Categories: ${product.category.join(", ")}) - $${product.sellingPrice}
    Variations: ${product.Variation.map((v) => `${v.color} ${v.size} ($${v.price})`).join(", ")}`,
  )
  .join("\n")}

CATEGORIES AVAILABLE:
${uniqueCategories.join(", ")}

USER CONTEXT:
- Logged in: ${user ? "Yes" : "No"}
- User tier: ${user?.tier || "Guest"}
- Current page: ${context.currentPage || "Unknown"}
- Items in cart: ${userCart?.cartItems?.length || 0}
- Recent orders: ${userOrders.length}

INSTRUCTIONS:
- Provide specific product recommendations from the available products
- When users ask about categories, mention the exact categories we have
- For product questions, reference actual products and their variations
- Be helpful and specific, using real data
- If asked about products not in our catalog, suggest similar alternatives from our available products
- Help with order tracking, cart management, and general shopping questions`;

    console.log("Sending request to Claude with real product data...");

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    });

    const aiResponse =
      response.content[0].type === "text"
        ? response.content[0].text
        : "I apologize, but I encountered an error processing your request.";

    res.status(200).json({
      response: aiResponse,
      conversationId: conversationId || `conv_${Date.now()}`,
      context: {
        productsCount: products.length,
        categoriesCount: uniqueCategories.length,
        userLoggedIn: !!user,
      },
    });
  } catch (error) {
    console.error("AI Chat API Error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
