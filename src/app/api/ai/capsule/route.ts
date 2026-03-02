import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Items array required" }, { status: 400 });
    }

    const itemsSummary = items.map((item: {
      id: string;
      category: string;
      subcategory: string;
      brand: string;
      color: string[];
      season: string[];
      occasion: string[];
      wearCount: number;
      price: number;
      material: string;
      styleTags: string[];
    }) =>
      `ID:${item.id} | ${item.brand} ${item.subcategory} (${item.category}) | Colors: ${item.color.join(",")} | Seasons: ${item.season.join(",")} | Occasions: ${item.occasion.join(",")} | Wears: ${item.wearCount} | Price: $${item.price} | Material: ${item.material} | Tags: ${item.styleTags.join(",")}`
    ).join("\n");

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: `You are a capsule wardrobe expert. Analyze the user's closet items and recommend a capsule wardrobe of 20-35 essential pieces. Consider versatility, season coverage, color coordination, and outfit combinations.

Respond with ONLY valid JSON in this exact structure (no markdown, no extra text):
{
  "essential": [{"itemId": "item-X", "reason": "why this item is essential"}],
  "extras": [{"itemId": "item-X", "reason": "why this is not essential"}],
  "gaps": [{"category": "category name", "description": "what's missing and why"}],
  "summary": "2-3 sentence overall assessment"
}

Use only item IDs that exist in the provided list. Make essential items no more than 35 and no less than 10.`,
      messages: [
        {
          role: "user",
          content: `Analyze these ${items.length} closet items and build a capsule wardrobe:\n\n${itemsSummary}`,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const text = textBlock?.text || "{}";

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({
        essential: items.slice(0, Math.min(12, items.length)).map((item: { id: string; category: string }) => ({
          itemId: item.id,
          reason: `Core ${item.category} piece for your capsule wardrobe`,
        })),
        extras: items.slice(12).map((item: { id: string; category: string }) => ({
          itemId: item.id,
          reason: `Supplementary ${item.category} - consider rotating seasonally`,
        })),
        gaps: [
          { category: "basics", description: "Consider adding more neutral foundation pieces" },
        ],
        summary: "Your wardrobe has good variety. Focus on versatile basics to maximize outfit combinations.",
      });
    }
  } catch (error) {
    console.error("Capsule generation error:", error);
    return NextResponse.json({ error: "Capsule generation failed" }, { status: 500 });
  }
}
