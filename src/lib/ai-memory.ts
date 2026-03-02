"use client";

import { ClothingItem, Outfit } from "@/types";

const STYLE_DNA_KEY = "mycloset_style_dna";

export interface StyleDNAProfile {
  colorPreferences: Record<string, number>;
  brandPreferences: Record<string, number>;
  categoryPreferences: Record<string, number>;
  occasionPreferences: Record<string, number>;
  seasonPreferences: Record<string, number>;
  styleTags: Record<string, number>;
  patternPreferences: Record<string, number>;
  materialPreferences: Record<string, number>;
  favoriteCombos: { items: string[]; count: number }[];
  quizResults: string[];
  outfitsLogged: number;
  lastUpdated: string;
}

function getDefault(): StyleDNAProfile {
  return {
    colorPreferences: {},
    brandPreferences: {},
    categoryPreferences: {},
    occasionPreferences: {},
    seasonPreferences: {},
    styleTags: {},
    patternPreferences: {},
    materialPreferences: {},
    favoriteCombos: [],
    quizResults: [],
    outfitsLogged: 0,
    lastUpdated: new Date().toISOString(),
  };
}

function loadProfile(): StyleDNAProfile {
  if (typeof window === "undefined") return getDefault();
  const stored = localStorage.getItem(STYLE_DNA_KEY);
  if (!stored) return getDefault();
  try {
    return JSON.parse(stored);
  } catch {
    return getDefault();
  }
}

function saveProfile(profile: StyleDNAProfile) {
  if (typeof window === "undefined") return;
  profile.lastUpdated = new Date().toISOString();
  localStorage.setItem(STYLE_DNA_KEY, JSON.stringify(profile));
}

function incrementMap(map: Record<string, number>, key: string, amount = 1) {
  map[key] = (map[key] || 0) + amount;
}

export function buildStyleDNA(
  closetItems: ClothingItem[],
  outfits: Outfit[],
  quizResults?: string[]
): StyleDNAProfile {
  const profile = loadProfile();

  // Reset derived preferences from closet
  profile.colorPreferences = {};
  profile.brandPreferences = {};
  profile.categoryPreferences = {};
  profile.occasionPreferences = {};
  profile.seasonPreferences = {};
  profile.styleTags = {};
  profile.patternPreferences = {};
  profile.materialPreferences = {};

  // Analyze closet items
  for (const item of closetItems) {
    // Weight by wear count for better personalization
    const weight = Math.max(1, Math.ceil(item.wear_count / 5));

    for (const color of item.color) {
      incrementMap(profile.colorPreferences, color, weight);
    }

    if (item.brand) {
      incrementMap(profile.brandPreferences, item.brand, weight);
    }

    incrementMap(profile.categoryPreferences, item.category, weight);

    for (const occasion of item.occasion) {
      incrementMap(profile.occasionPreferences, occasion, weight);
    }

    for (const season of item.season) {
      incrementMap(profile.seasonPreferences, season, weight);
    }

    for (const tag of item.style_tags) {
      incrementMap(profile.styleTags, tag, weight);
    }

    if (item.pattern) {
      incrementMap(profile.patternPreferences, item.pattern, weight);
    }

    if (item.material) {
      incrementMap(profile.materialPreferences, item.material, weight);
    }
  }

  // Analyze outfits for combo preferences
  const comboMap = new Map<string, number>();
  for (const outfit of outfits) {
    const categories = outfit.items.map((i) => i.category).sort();
    const key = categories.join("+");
    comboMap.set(key, (comboMap.get(key) || 0) + 1);
  }
  profile.favoriteCombos = Array.from(comboMap.entries())
    .map(([items, count]) => ({ items: items.split("+"), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  profile.outfitsLogged = outfits.length;

  if (quizResults && quizResults.length > 0) {
    profile.quizResults = quizResults;
  }

  saveProfile(profile);
  return profile;
}

export function getTopItems(
  map: Record<string, number>,
  limit = 5
): { name: string; count: number }[] {
  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

export function getStyleDNAContext(profile: StyleDNAProfile): string {
  const topColors = getTopItems(profile.colorPreferences, 5);
  const topBrands = getTopItems(profile.brandPreferences, 5);
  const topStyles = getTopItems(profile.styleTags, 5);
  const topOccasions = getTopItems(profile.occasionPreferences, 3);
  const topPatterns = getTopItems(profile.patternPreferences, 3);
  const topMaterials = getTopItems(profile.materialPreferences, 3);

  return `STYLE DNA PROFILE:
- Favorite colors: ${topColors.map((c) => c.name).join(", ")}
- Preferred brands: ${topBrands.map((b) => b.name).join(", ")}
- Style identity: ${topStyles.map((s) => s.name).join(", ")}
- Primary occasions: ${topOccasions.map((o) => o.name).join(", ")}
- Pattern preferences: ${topPatterns.map((p) => p.name).join(", ")}
- Material preferences: ${topMaterials.map((m) => m.name).join(", ")}
- Quiz style results: ${profile.quizResults.join(", ") || "Not taken yet"}
- Outfit history: ${profile.outfitsLogged} outfits logged
- Favorite combos: ${profile.favoriteCombos.slice(0, 3).map((c) => c.items.join(" + ")).join("; ")}`;
}

export function getStyleDNAProfile(): StyleDNAProfile {
  return loadProfile();
}

export function getPrimaryStyle(profile: StyleDNAProfile): string {
  const topTags = getTopItems(profile.styleTags, 3);
  if (topTags.length === 0) return "Eclectic";
  return topTags.map((t) => t.name.charAt(0).toUpperCase() + t.name.slice(1)).join(" ");
}
