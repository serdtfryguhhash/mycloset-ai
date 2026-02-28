import { ClothingCategory } from "@/types";

export interface AIClothingAnalysis {
  category: ClothingCategory;
  subcategory: string;
  brand: string;
  colors: string[];
  pattern: string;
  material: string;
  style_tags: string[];
  season: string[];
  occasion: string[];
  description: string;
  confidence: number;
}

export async function analyzeClothingImage(imageUrl: string): Promise<AIClothingAnalysis> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "analyze-clothing",
      image_url: imageUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze clothing image");
  }

  const data = await response.json();
  return data.analysis;
}

export async function generateOutfitVisualization(
  outfitItems: { name: string; category: string; color: string }[],
  style: string
): Promise<string> {
  const prompt = `Fashion flat-lay arrangement of: ${outfitItems
    .map((i) => `${i.color} ${i.name}`)
    .join(", ")}. Style: ${style}. Professional fashion photography, white background.`;

  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "generate-visualization",
      outfit_items: outfitItems,
      prompt,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate visualization");
  }

  const data = await response.json();
  return data.visualization_url;
}

export async function getStyleRecommendations(
  closetSummary: { categories: string[]; colors: string[]; brands: string[] }
): Promise<string[]> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "style-recommendations",
      closet_summary: closetSummary,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get recommendations");
  }

  const data = await response.json();
  return data.recommendations;
}
