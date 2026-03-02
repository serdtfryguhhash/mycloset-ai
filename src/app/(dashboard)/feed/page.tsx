"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostCard from "@/components/feed/PostCard";
import XPBar from "@/components/shared/XPBar";
import StyleDNA from "@/components/features/style-dna";
import OOTDStreak from "@/components/features/ootd-streak";
import WeeklyChallenge from "@/components/features/weekly-challenge";
import OutfitPlanner from "@/components/features/outfit-planner";
import SeasonalReportSection from "@/components/features/seasonal-report";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { mockUsers } from "@/lib/mock-data";

export default function FeedPage() {
  const { posts, feedTab, setFeedTab } = useStore();
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { key: "all", label: "All" },
    { key: "ootd", label: "OOTD" },
    { key: "streetstyle", label: "Streetwear" },
    { key: "minimal", label: "Minimal" },
    { key: "sustainable", label: "Sustainable" },
    { key: "vintage", label: "Vintage" },
  ];

  const suggestedUsers = mockUsers.slice(1, 4);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Feed */}
          <div>
            {/* XP Bar */}
            <div className="mb-4">
              <XPBar />
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-1 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
              <button
                onClick={() => setFeedTab("following")}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-medium transition-all",
                  feedTab === "following"
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Users className="w-4 h-4" />
                <span>Following</span>
              </button>
              <button
                onClick={() => setFeedTab("explore")}
                className={cn(
                  "flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-medium transition-all",
                  feedTab === "explore"
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Trending</span>
              </button>
            </div>

            {/* Story-like filters */}
            <div className="flex space-x-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                    activeFilter === filter.key
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Create Post CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-4 mb-6 border border-primary/10"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Share your outfit today</p>
                  <p className="text-xs text-gray-500">Create a post and inspire the community</p>
                </div>
                <Link href="/outfits/generate">
                  <Button size="sm">Create</Button>
                </Link>
              </div>
            </motion.div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center py-8">
              <Button variant="outline" size="lg">
                Load More Posts
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-6">
            {/* Style DNA Summary */}
            <StyleDNA />

            {/* OOTD Streak */}
            <OOTDStreak />

            {/* Weekly Challenge */}
            <WeeklyChallenge />

            {/* Outfit Planner */}
            <OutfitPlanner />

            {/* Seasonal Report */}
            <SeasonalReportSection />

            {/* Suggested Users */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-sora font-semibold text-sm mb-4">Suggested for You</h3>
              <div className="space-y-4">
                {suggestedUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between">
                    <Link href={`/profile/${u.username}`} className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={u.avatar_url} />
                        <AvatarFallback>{u.display_name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{u.display_name}</p>
                        <p className="text-xs text-gray-400">@{u.username}</p>
                      </div>
                    </Link>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Tags */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-sora font-semibold text-sm mb-4 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Trending Now</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {["WinterStyle", "CasualChic", "StreetWear", "OOTDInspo", "MinimalFashion", "DateNightLook", "ThriftFlip", "Y2K"].map((tag) => (
                  <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-colors">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-xs text-gray-400 space-y-2">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <a href="#" className="hover:text-gray-600">About</a>
                <a href="#" className="hover:text-gray-600">Help</a>
                <a href="#" className="hover:text-gray-600">Press</a>
                <a href="#" className="hover:text-gray-600">API</a>
                <a href="#" className="hover:text-gray-600">Privacy</a>
                <a href="#" className="hover:text-gray-600">Terms</a>
              </div>
              <p>&copy; 2026 MyCloset.ai</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
