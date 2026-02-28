"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Plus,
  Heart,
  Calendar,
  Cloud,
  Star,
  Eye,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useStore } from "@/store";
import { cn, OCCASION_LABELS, SEASON_LABELS } from "@/lib/utils";

export default function OutfitsPage() {
  const { outfits } = useStore();
  const [filter, setFilter] = useState("all");

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-sora font-bold mb-1">My Outfits</h1>
            <p className="text-gray-500">Your curated outfit collection</p>
          </div>
          <Link href="/outfits/generate">
            <Button className="mt-4 sm:mt-0">
              <Sparkles className="w-4 h-4 mr-2" /> Generate Outfit
            </Button>
          </Link>
        </div>

        {/* Filter */}
        <div className="flex space-x-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
          {["all", "ai_generated", "manual", "favorites"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                filter === f
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200"
              )}
            >
              {f === "all" ? "All Outfits" : f === "ai_generated" ? "AI Generated" : f === "manual" ? "Manual" : "Favorites"}
            </button>
          ))}
        </div>

        {/* Outfits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfits.map((outfit, i) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {outfit.ai_visualization_url ? (
                    <img
                      src={outfit.ai_visualization_url}
                      alt={outfit.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-2 p-4">
                        {outfit.items.slice(0, 4).map((item) => (
                          <img
                            key={item.id}
                            src={item.thumbnail_url}
                            alt=""
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {outfit.ai_generated && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-primary to-secondary border-0">
                      <Sparkles className="w-3 h-3 mr-1" /> AI Generated
                    </Badge>
                  )}

                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm">
                    <Heart
                      className={cn(
                        "w-4 h-4",
                        outfit.is_favorite ? "fill-red-500 text-red-500" : "text-gray-600"
                      )}
                    />
                  </button>

                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-sora font-semibold text-lg mb-1">{outfit.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{outfit.description}</p>

                  <div className="flex items-center space-x-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{OCCASION_LABELS[outfit.occasion]}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Cloud className="w-3 h-3" />
                      <span>{SEASON_LABELS[outfit.season]}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {outfit.items.slice(0, 4).map((item) => (
                        <img
                          key={item.id}
                          src={item.thumbnail_url}
                          alt=""
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      {outfit.items.length > 4 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">
                          +{outfit.items.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-sm font-semibold">{outfit.style_score}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {outfits.length === 0 && (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No outfits yet</h3>
            <p className="text-gray-400 mb-6">Let AI create your perfect outfit combinations</p>
            <Link href="/outfits/generate">
              <Button>
                <Sparkles className="w-4 h-4 mr-2" /> Generate Your First Outfit
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
