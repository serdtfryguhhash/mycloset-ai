"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  getXPData,
  getCurrentLevel,
  getNextLevel,
  getLevelProgress,
  addXP,
  initializeXP,
  XPData,
} from "@/lib/gamification";

export default function XPBar() {
  const [xpData, setXpData] = useState<XPData | null>(null);

  useEffect(() => {
    // Initialize with base XP for demo, then track daily visit
    const data = initializeXP(850);
    const result = addXP("daily_visit");
    setXpData(result.data);
  }, []);

  if (!xpData) return null;

  const level = getCurrentLevel(xpData.totalXP);
  const next = getNextLevel(xpData.totalXP);
  const progress = getLevelProgress(xpData.totalXP);

  return (
    <Card className="p-3">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center text-lg`}>
          {level.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-semibold text-gray-800">{level.name}</span>
              <span className="flex items-center text-xs text-primary font-medium">
                <Zap className="w-3 h-3 mr-0.5" />
                {xpData.totalXP} XP
              </span>
            </div>
            {next && (
              <span className="text-[10px] text-gray-400">{next.minXP - xpData.totalXP} to {next.name}</span>
            )}
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" as const }}
              className={`h-full rounded-full bg-gradient-to-r ${level.color}`}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
