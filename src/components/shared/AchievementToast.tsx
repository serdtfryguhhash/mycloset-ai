"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { StyleLevel } from "@/lib/gamification";

interface AchievementToastProps {
  level: StyleLevel;
  xpGained: number;
}

export default function AchievementToast({ level, xpGained }: AchievementToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="flex items-center space-x-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4 shadow-lg max-w-sm"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center text-2xl shadow-md`}>
        {level.icon}
      </div>
      <div>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-sm font-bold text-amber-800">Level Up!</span>
        </div>
        <p className="text-sm font-semibold text-gray-800">{level.name}</p>
        <p className="text-xs text-gray-500">+{xpGained} XP earned</p>
      </div>
    </motion.div>
  );
}
