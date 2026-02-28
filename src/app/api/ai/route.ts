import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

async function analyzeClothing(imageUrl: string) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: `You are a fashion AI assistant that analyzes clothing items. Given a description or context about a clothing image, return a JSON analysis. You must respond with ONLY valid JSON, no markdown or extra text. Use this exact structure:
{
  "category": "tops" | "bottoms" | "dresses" | "outerwear" | "shoes" | "accessories",
  "subcategory": "string",
  "brand": "string or Unknown",
  "colors": ["array of color strings"],
  "pattern": "solid" | "striped" | "plaid" | "floral" | "geometric" | "abstract" | "other",
  "material": "string",
  "style_tags": ["array of style descriptor strings"],
  "season": ["array: spring, summer, fall, winter, or all"],
  "occasion": ["array: casual, formal, business, athletic, evening, everyday"],
  "description": "A brief natural language description of the item",
  "confidence": 0.85
}`,
    messages: [
      {
        role: "user",
        content: `Analyze this clothing item. The image URL is: ${imageUrl}. Based on any context you can gather from the URL and filename, provide your best analysis of what this clothing item likely is. Return only JSON.`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const text = textBlock?.text || "{}";

  try {
    return JSON.parse(text);
  } catch {
    return {
      category: "tops",
      subcategory: "top",
      brand: "Unknown",
      colors: ["unknown"],
      pattern: "solid",
      material: "unknown",
      style_tags: ["casual"],
      season: ["all"],
      occasion: ["casual", "everyday"],
      description: text,
      confidence: 0.5,
    };
  }
}

async function getStyleRecommendations(closetSummary: {
  categories: string[];
  colors: string[];
  brands: string[];
}) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: `You are a professional fashion stylist AI. Given a summary of someone's closet, provide personalized style recommendations. Respond with ONLY a JSON array of exactly 3 recommendation strings. No markdown, no extra text. Example: ["Tip 1", "Tip 2", "Tip 3"]`,
    messages: [
      {
        role: "user",
        content: `Here is a summary of my closet:
- Categories I own: ${closetSummary.categories.join(", ") || "various"}
- Colors I have: ${closetSummary.colors.join(", ") || "various"}
- Brands I wear: ${closetSummary.brands.join(", ") || "various"}

Give me 3 specific, actionable style recommendations based on what I already own.`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const text = textBlock?.text || "[]";

  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [text];
  } catch {
    return [
      "Try mixing textures in your outfits for added visual interest.",
      "Consider a capsule wardrobe approach with your most versatile pieces.",
      "Accessorize to transform the same outfit for different occasions.",
    ];
  }
}

async function generateVisualizationSearchTerm(
  outfitItems: { name: string; category: string; color: string }[],
  prompt: string
) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 100,
    system: `You are a fashion search term generator. Given outfit items, generate a single concise Unsplash search query (2-4 words) that would find a relevant fashion photo. Respond with ONLY the search term, nothing else.`,
    messages: [
      {
        role: "user",
        content: `Generate an Unsplash search term for this outfit: ${outfitItems
          .map((i) => `${i.color} ${i.name}`)
          .join(", ")}. Style context: ${prompt}`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.text?.trim() || "fashion outfit flatlay";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, image_url, outfit_items, prompt, closet_summary } = body;

    if (action === "analyze-clothing") {
      const analysis = await analyzeClothing(image_url);
      return NextResponse.json({ analysis });
    }

    if (action === "generate-visualization") {
      const searchTerm = await generateVisualizationSearchTerm(
        outfit_items || [],
        prompt || "fashion outfit"
      );
      const encodedTerm = encodeURIComponent(searchTerm);
      return NextResponse.json({
        visualization_url: `https://source.unsplash.com/800x600/?${encodedTerm}`,
        type: "flat_lay",
        prompt_used: prompt || "Fashion flat-lay arrangement",
        search_term: searchTerm,
      });
    }

    if (action === "style-recommendations") {
      const recommendations = await getStyleRecommendations(
        closet_summary || { categories: [], colors: [], brands: [] }
      );
      return NextResponse.json({ recommendations });
    }

    return NextResponse.json({ error: "Invalid AI action" }, { status: 400 });
  } catch (error) {
    console.error("AI processing error:", error);
    return NextResponse.json({ error: "AI processing failed" }, { status: 500 });
  }
}
