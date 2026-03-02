"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import WardrobeAnalytics from "@/components/features/wardrobe-analytics";
import ShareCard from "@/components/shared/ShareCard";
import Link from "next/link";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-sora font-bold mb-1 flex items-center space-x-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              <span>Wardrobe Analytics</span>
            </h1>
            <p className="text-gray-500">Insights into your wardrobe usage, costs, and style patterns</p>
          </div>
          <Badge variant="pink" className="mt-2 sm:mt-0">Real-time Data</Badge>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <WardrobeAnalytics />

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Share Your Style Stats</h3>
              <ShareCard />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
