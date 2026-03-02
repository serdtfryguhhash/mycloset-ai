import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, outfitCount, season } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Items array required" }, { status: 400 });
    }

    const itemsSummary = items
      .map((item: {
        name: string;
        category: string;
        color: string[];
        wearCount: number;
        price: number;
        season: string[];
      }) =>
        `${item.name} (${item.category}) - Colors: ${item.color.join(",")} - Wears: ${item.wearCount} - Price: $${item.price} - Seasons: ${item.season.join(",")}`
      )
      .join("\n");

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: `You are a fashion analytics AI. Generate a seasonal wardrobe report. Respond with ONLY valid JSON (no markdown, no extra text) in this exact structure:
{
  "season": "${season || "Winter"}",
  "mostWornItems": [{"name": "string", "wears": number}],
  "costPerWearLeaders": [{"name": "string", "cpw": "$X.XX"}],
  "styleEvolution": "2-3 sentence analysis of style trends",
  "trendingColors": ["color1", "color2", "color3", "color4", "color5"],
  "shoppingRecommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "overallScore": number between 70 and 98
}

Keep mostWornItems to top 5 and costPerWearLeaders to top 5. Base all data on the actual items provided.`,
      messages: [
        {
          role: "user",
          content: `Generate a ${season || "seasonal"} wardrobe report based on these ${items.length} items and ${outfitCount || 0} outfits created:\n\n${itemsSummary}`,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const text = textBlock?.text || "{}";

    try {
      const parsed = JSON.parse(text);
      parsed.generatedAt = new Date().toISOString();
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({
        season: season || "Winter",
        mostWornItems: items
          .sort((a: { wearCount: number }, b: { wearCount: number }) => b.wearCount - a.wearCount)
          .slice(0, 5)
          .map((item: { name: string; wearCount: number }) => ({ name: item.name, wears: item.wearCount })),
        costPerWearLeaders: items
          .filter((i: { wearCount: number }) => i.wearCount > 0)
          .map((item: { name: string; price: number; wearCount: number }) => ({
            name: item.name,
            cpw: `$${(item.price / item.wearCount).toFixed(2)}`,
          }))
          .sort((a: { cpw: string }, b: { cpw: string }) =>
            parseFloat(a.cpw.replace("$", "")) - parseFloat(b.cpw.replace("$", ""))
          )
          .slice(0, 5),
        styleEvolution: "Your style shows a strong foundation with room for seasonal exploration.",
        trendingColors: ["black", "white", "navy", "cream", "brown"],
        shoppingRecommendations: [
          "A versatile layering piece for transitional weather",
          "Statement accessories to refresh existing outfits",
          "Comfortable yet stylish footwear for daily wear",
        ],
        overallScore: 85,
        generatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Seasonal report error:", error);
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 });
  }
}
