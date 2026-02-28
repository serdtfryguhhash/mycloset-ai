import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const closetContext = context
      ? `The user's closet contains: ${JSON.stringify(context)}. Use this information to give personalized advice.`
      : "The user hasn't shared their closet details yet. Give general fashion advice and ask about their wardrobe.";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `You are MyCloset AI, a friendly and knowledgeable personal fashion stylist assistant. You help users with:
- Outfit suggestions based on their wardrobe
- Style advice for specific occasions
- Color coordination and pattern mixing tips
- Seasonal fashion recommendations
- Shopping suggestions to fill wardrobe gaps

Be conversational, enthusiastic about fashion, and give specific actionable advice. Keep responses concise (2-3 paragraphs max).

${closetContext}`,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const aiResponse = textBlock?.text || "I'd be happy to help with your style! Could you tell me more about what you're looking for?";

    return NextResponse.json({
      response: aiResponse,
      suggestions: [
        "What should I wear for a date night?",
        "Help me style my new leather jacket",
        "What are trending styles this season?",
      ],
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
