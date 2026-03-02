"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sun,
  Cloud,
  Briefcase,
  Heart,
  PartyPopper,
  Shirt,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import { addXP } from "@/lib/gamification";
import toast from "react-hot-toast";

const OOTD_STORAGE_KEY = "mycloset_ootd_log";

interface OOTDEntry {
  date: string;
  outfitId: string | null;
  outfitName: string;
  occasion: string;
  mood: string;
  weather: string;
  imageUrl?: string;
}

interface OOTDData {
  entries: Record<string, OOTDEntry>;
  currentStreak: number;
  longestStreak: number;
}

const MOODS = ["Confident", "Cozy", "Bold", "Relaxed", "Professional", "Playful"];
const OCCASIONS = ["Work", "Casual", "Date Night", "Party", "Workout", "Brunch"];
const WEATHER_OPTIONS = ["Sunny", "Cloudy", "Rainy", "Cold", "Hot", "Windy"];

const STREAK_BADGES = [
  { days: 7, name: "Week Warrior", icon: "🔥" },
  { days: 30, name: "Monthly Maven", icon: "⭐" },
  { days: 100, name: "Century Stylist", icon: "💎" },
  { days: 365, name: "Year of Style", icon: "🏆" },
];

function loadOOTD(): OOTDData {
  if (typeof window === "undefined") return { entries: {}, currentStreak: 0, longestStreak: 0 };
  const stored = localStorage.getItem(OOTD_STORAGE_KEY);
  if (!stored) return { entries: {}, currentStreak: 0, longestStreak: 0 };
  try {
    return JSON.parse(stored);
  } catch {
    return { entries: {}, currentStreak: 0, longestStreak: 0 };
  }
}

function saveOOTD(data: OOTDData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OOTD_STORAGE_KEY, JSON.stringify(data));
}

function calculateStreak(entries: Record<string, OOTDEntry>): number {
  const today = new Date();
  let streak = 0;
  const d = new Date(today);

  while (true) {
    const key = d.toISOString().split("T")[0];
    if (entries[key]) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function OOTDStreak() {
  const { outfits } = useStore();
  const [data, setData] = useState<OOTDData>({ entries: {}, currentStreak: 0, longestStreak: 0 });
  const [showLogModal, setShowLogModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedOutfit, setSelectedOutfit] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedWeather, setSelectedWeather] = useState("");

  useEffect(() => {
    const loaded = loadOOTD();
    loaded.currentStreak = calculateStreak(loaded.entries);
    loaded.longestStreak = Math.max(loaded.longestStreak, loaded.currentStreak);
    setData(loaded);
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const hasLoggedToday = !!data.entries[today];

  const handleLog = () => {
    if (!selectedOutfit) {
      toast.error("Please select an outfit");
      return;
    }

    const outfit = outfits.find((o) => o.id === selectedOutfit);
    const entry: OOTDEntry = {
      date: today,
      outfitId: selectedOutfit,
      outfitName: outfit?.name || "Custom Outfit",
      occasion: selectedOccasion || "Casual",
      mood: selectedMood || "Confident",
      weather: selectedWeather || "Sunny",
      imageUrl: outfit?.ai_visualization_url || undefined,
    };

    const newData = { ...data };
    newData.entries[today] = entry;
    newData.currentStreak = calculateStreak(newData.entries);
    newData.longestStreak = Math.max(newData.longestStreak, newData.currentStreak);
    saveOOTD(newData);
    setData(newData);

    const xpResult = addXP("log_outfit");

    toast.success(`OOTD logged! +${xpResult.gained} XP`);
    setShowLogModal(false);
    setSelectedOutfit("");
    setSelectedMood("");
    setSelectedOccasion("");
    setSelectedWeather("");
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const earnedBadges = STREAK_BADGES.filter((b) => data.longestStreak >= b.days);

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>OOTD Streak</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="pink" className="text-xs font-bold">
                {data.currentStreak} day{data.currentStreak !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Streak Badges */}
          {earnedBadges.length > 0 && (
            <div className="flex items-center space-x-2">
              {earnedBadges.map((badge) => (
                <span key={badge.days} className="text-lg" title={badge.name}>
                  {badge.icon}
                </span>
              ))}
            </div>
          )}

          {/* Mini Calendar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>
                <ChevronLeft className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
              <span className="text-xs font-semibold text-gray-600">{monthName}</span>
              <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>
                <ChevronRight className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-[10px] text-gray-400 font-medium py-1">{d}</div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const hasEntry = !!data.entries[dateStr];
                const isToday = dateStr === today;

                return (
                  <motion.div
                    key={day}
                    whileHover={{ scale: 1.2 }}
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium mx-auto cursor-default",
                      hasEntry && "bg-gradient-to-br from-orange-400 to-pink-500 text-white",
                      isToday && !hasEntry && "ring-2 ring-primary/30",
                      !hasEntry && !isToday && "text-gray-400"
                    )}
                    title={hasEntry ? data.entries[dateStr].outfitName : undefined}
                  >
                    {day}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Log Button */}
          <Button
            className="w-full"
            size="sm"
            onClick={() => setShowLogModal(true)}
            disabled={hasLoggedToday}
          >
            {hasLoggedToday ? (
              <>
                <Shirt className="w-4 h-4 mr-2" />
                Logged Today
              </>
            ) : (
              <>
                <Flame className="w-4 h-4 mr-2" />
                Log Today&apos;s Outfit
              </>
            )}
          </Button>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Best: {data.longestStreak} days</span>
            <span>{Object.keys(data.entries).length} total logged</span>
          </div>
        </CardContent>
      </Card>

      {/* Log Modal */}
      <Dialog open={showLogModal} onOpenChange={setShowLogModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>Log Today&apos;s Outfit</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Select Outfit */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Outfit</label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {outfits.map((outfit) => (
                  <button
                    key={outfit.id}
                    onClick={() => setSelectedOutfit(outfit.id)}
                    className={cn(
                      "p-2 rounded-xl text-xs text-left border transition-all",
                      selectedOutfit === outfit.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {outfit.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Occasion</label>
              <div className="flex flex-wrap gap-1.5">
                {OCCASIONS.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-all",
                      selectedOccasion === occ
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Mood</label>
              <div className="flex flex-wrap gap-1.5">
                {MOODS.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-all",
                      selectedMood === mood
                        ? "bg-secondary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Weather</label>
              <div className="flex flex-wrap gap-1.5">
                {WEATHER_OPTIONS.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeather(w)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-all",
                      selectedWeather === w
                        ? "bg-accent text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={handleLog}>
              <Flame className="w-4 h-4 mr-2" />
              Log Outfit (+15 XP)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
