"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import { Search, TrendingUp, Sparkles, Filter, Grid, LayoutGrid } from "lucide-react";
import PostCard from "@/components/feed/PostCard";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

const categories = [
  { key: "all", label: "All", emoji: "✨" },
  { key: "ootd", label: "OOTD", emoji: "👗" },
  { key: "street", label: "Street Style", emoji: "🛹" },
  { key: "minimal", label: "Minimal", emoji: "🤍" },
  { key: "vintage", label: "Vintage", emoji: "🕰️" },
  { key: "boho", label: "Boho", emoji: "🌻" },
  { key: "formal", label: "Formal", emoji: "🥂" },
  { key: "athletic", label: "Athletic", emoji: "🏃" },
];

export default function ExplorePage() {
  const { posts } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"masonry" | "grid">("masonry");

  const breakpointColumns = {
    default: 3,
    1100: 3,
    768: 2,
    500: 2,
  };

  const allPosts = [...posts, ...posts.map((p, i) => ({ ...p, id: `${p.id}-dup-${i}` }))];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-sora font-bold mb-2">Explore</h1>
          <p className="text-gray-500">Discover trending styles and get inspired</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search styles, users, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === cat.key
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30"
              )}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Trending Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-sora font-semibold text-lg">Trending Now</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("masonry")}
                className={cn("p-2 rounded-lg", viewMode === "masonry" ? "bg-primary/10 text-primary" : "text-gray-400")}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn("p-2 rounded-lg", viewMode === "grid" ? "bg-primary/10 text-primary" : "text-gray-400")}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {viewMode === "masonry" ? (
            <Masonry
              breakpointCols={breakpointColumns}
              className="masonry-grid"
              columnClassName="masonry-grid-column"
            >
              {allPosts.map((post, i) => (
                <div key={post.id} className="mb-4">
                  <PostCard post={post} compact />
                </div>
              ))}
            </Masonry>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allPosts.map((post) => (
                <PostCard key={post.id} post={post} compact />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
