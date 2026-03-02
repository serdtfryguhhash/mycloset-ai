"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Share2, Download, Copy, Check, Shirt, Heart, Palette } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store";
import { getCurrentLevel, getXPData } from "@/lib/gamification";
import toast from "react-hot-toast";

const COLOR_HEX: Record<string, string> = {
  black: "#1C1917", white: "#FFFFFF", blue: "#3B82F6", indigo: "#4F46E5",
  green: "#22C55E", red: "#EF4444", pink: "#EC4899", cream: "#FFFDD0",
  navy: "#1E3A5F", beige: "#F5F5DC", brown: "#8B4513", gray: "#9CA3AF",
  camel: "#C19A6B", sage: "#9CAF88", tan: "#D2B48C", nude: "#E8C4A2", gold: "#FFD700",
};

export default function ShareCard() {
  const { closetItems, outfits, user } = useStore();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const xpData = getXPData();
  const level = getCurrentLevel(xpData.totalXP);

  // Calculate most-worn color
  const colorCounts: Record<string, number> = {};
  closetItems.forEach((item) => {
    item.color.forEach((c) => {
      colorCounts[c] = (colorCounts[c] || 0) + item.wear_count;
    });
  });
  const topColor = Object.entries(colorCounts).sort(([, a], [, b]) => b - a)[0];
  const topColorName = topColor ? topColor[0] : "black";

  const topColors = Object.entries(colorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name]) => name);

  const statsText = `My Closet: ${closetItems.length} items, ${outfits.length} outfits created, most-worn color: ${topColorName}!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(statsText);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Preview Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-6 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <p className="font-sora font-bold text-lg">{user?.display_name || "Fashionista"}</p>
              <p className="text-xs opacity-80">@{user?.username || "stylish"}</p>
            </div>
            <div className="ml-auto">
              <div className={`px-3 py-1 rounded-full bg-white/20 text-xs font-bold flex items-center space-x-1`}>
                <span>{level.icon}</span>
                <span>{level.name}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-white/10 rounded-xl">
              <p className="text-2xl font-sora font-bold">{closetItems.length}</p>
              <p className="text-[10px] uppercase tracking-wide opacity-70">Items</p>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-xl">
              <p className="text-2xl font-sora font-bold">{outfits.length}</p>
              <p className="text-[10px] uppercase tracking-wide opacity-70">Outfits</p>
            </div>
            <div className="text-center p-3 bg-white/10 rounded-xl">
              <p className="text-2xl font-sora font-bold">{xpData.totalXP}</p>
              <p className="text-[10px] uppercase tracking-wide opacity-70">XP</p>
            </div>
          </div>

          {/* Color Swatches */}
          <div className="flex items-center space-x-2 mb-3">
            <Palette className="w-4 h-4 opacity-70" />
            <span className="text-xs opacity-70">My Colors:</span>
            <div className="flex space-x-1.5">
              {topColors.map((color) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded-full border-2 border-white/30 shadow-sm"
                  style={{ backgroundColor: COLOR_HEX[color] || "#9CA3AF" }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Most Worn */}
          <div className="flex items-center space-x-2 text-xs opacity-80">
            <Heart className="w-3.5 h-3.5" />
            <span>Most-worn color: <span className="font-semibold capitalize">{topColorName}</span></span>
          </div>

          {/* Brand */}
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
            <span className="text-[10px] opacity-50">Powered by MyCloset.ai</span>
            <Share2 className="w-4 h-4 opacity-50" />
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleCopy}
        >
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? "Copied!" : "Copy Stats"}
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => toast.success("Share card ready!")}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}
