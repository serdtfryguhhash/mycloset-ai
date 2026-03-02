"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dna, Palette, Tag, ShoppingBag, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store";
import {
  buildStyleDNA,
  getTopItems,
  getPrimaryStyle,
  StyleDNAProfile,
} from "@/lib/ai-memory";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const COLOR_MAP: Record<string, string> = {
  white: "#FFFFFF",
  cream: "#FFFDD0",
  black: "#1C1917",
  blue: "#3B82F6",
  indigo: "#4F46E5",
  green: "#22C55E",
  sage: "#9CAF88",
  red: "#EF4444",
  pink: "#EC4899",
  camel: "#C19A6B",
  tan: "#D2B48C",
  navy: "#1E3A5F",
  beige: "#F5F5DC",
  nude: "#E8C4A2",
  brown: "#8B4513",
  gray: "#9CA3AF",
  gold: "#FFD700",
  silver: "#C0C0C0",
};

function getColorHex(name: string): string {
  const lower = name.toLowerCase();
  return COLOR_MAP[lower] || "#9CA3AF";
}

export default function StyleDNA() {
  const { closetItems, outfits, user } = useStore();
  const [profile, setProfile] = useState<StyleDNAProfile | null>(null);

  useEffect(() => {
    const dna = buildStyleDNA(closetItems, outfits, user?.style_dna);
    setProfile(dna);
  }, [closetItems, outfits, user?.style_dna]);

  if (!profile) return null;

  const topColors = getTopItems(profile.colorPreferences, 8);
  const topBrands = getTopItems(profile.brandPreferences, 5);
  const topStyles = getTopItems(profile.styleTags, 6);
  const topCategories = getTopItems(profile.categoryPreferences, 6);
  const primaryStyle = getPrimaryStyle(profile);

  return (
    <motion.div
      custom={0}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Dna className="w-5 h-5 text-primary" />
              <span>Your Style DNA</span>
            </CardTitle>
            <Badge variant="pink" className="text-xs">{primaryStyle}</Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Built from {closetItems.length} items & {outfits.length} outfits
          </p>
        </CardHeader>
        <CardContent className="pt-4 space-y-5">
          {/* Color Palette */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Palette className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Color Palette</span>
            </div>
            <div className="flex items-center space-x-2">
              {topColors.map((color, i) => (
                <motion.div
                  key={color.name}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="group relative"
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200 cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: getColorHex(color.name) }}
                  />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 capitalize whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {color.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Top Brands */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Top Brands</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {topBrands.map((brand) => (
                <Badge key={brand.name} variant="outline" className="text-xs">
                  {brand.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Style Tags */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Style Identity</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {topStyles.map((style) => (
                <Badge key={style.name} variant="pink" className="text-xs capitalize">
                  {style.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Favorite Combos */}
          {profile.favoriteCombos.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Favorite Combos</span>
              </div>
              <div className="space-y-1">
                {profile.favoriteCombos.slice(0, 3).map((combo, i) => (
                  <div key={i} className="flex items-center text-xs text-gray-600">
                    <span className="capitalize">{combo.items.join(" + ")}</span>
                    <span className="ml-auto text-gray-400">{combo.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
