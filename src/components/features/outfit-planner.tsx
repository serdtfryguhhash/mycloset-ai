"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Sparkles,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Sun,
  Shirt,
  X,
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
import toast from "react-hot-toast";

const PLANNER_KEY = "mycloset_outfit_planner";

interface PlannedDay {
  date: string;
  outfitId: string | null;
  outfitName: string;
  itemIds: string[];
  event?: string;
}

type PlannerData = Record<string, PlannedDay>;

function loadPlanner(): PlannerData {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(PLANNER_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

function savePlanner(data: PlannerData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLANNER_KEY, JSON.stringify(data));
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MOCK_WEATHER = [
  { day: "Mon", icon: Sun, temp: "72°F", condition: "Sunny" },
  { day: "Tue", icon: Cloud, temp: "65°F", condition: "Cloudy" },
  { day: "Wed", icon: Sun, temp: "70°F", condition: "Partly Cloudy" },
  { day: "Thu", icon: Cloud, temp: "58°F", condition: "Overcast" },
  { day: "Fri", icon: Sun, temp: "68°F", condition: "Clear" },
  { day: "Sat", icon: Sun, temp: "75°F", condition: "Sunny" },
  { day: "Sun", icon: Cloud, temp: "62°F", condition: "Cloudy" },
];

function getWeekDates(offset: number = 0): string[] {
  const now = new Date();
  const monday = new Date(now);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff + offset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

export default function OutfitPlanner() {
  const { outfits, closetItems } = useStore();
  const [planner, setPlanner] = useState<PlannerData>({});
  const [weekOffset, setWeekOffset] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    setPlanner(loadPlanner());
  }, []);

  const weekDates = getWeekDates(weekOffset);
  const weekLabel = `${new Date(weekDates[0]).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(weekDates[6]).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  const handleAssign = (date: string, outfitId: string) => {
    const outfit = outfits.find((o) => o.id === outfitId);
    if (!outfit) return;

    const updated = { ...planner };
    updated[date] = {
      date,
      outfitId: outfit.id,
      outfitName: outfit.name,
      itemIds: outfit.item_ids,
    };
    savePlanner(updated);
    setPlanner(updated);
    setShowPicker(false);
    toast.success(`${outfit.name} assigned!`);
  };

  const handleClear = (date: string) => {
    const updated = { ...planner };
    delete updated[date];
    savePlanner(updated);
    setPlanner(updated);
  };

  const handleSurpriseMe = (date: string) => {
    if (outfits.length === 0) {
      toast.error("Create some outfits first!");
      return;
    }
    const randomOutfit = outfits[Math.floor(Math.random() * outfits.length)];
    handleAssign(date, randomOutfit.id);
    toast.success("Surprise outfit assigned!");
  };

  const plannedCount = weekDates.filter((d) => planner[d]).length;

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <CalendarDays className="w-5 h-5 text-secondary" />
              <span>Outfit Planner</span>
            </CardTitle>
            <Badge variant="purple" className="text-xs">
              {plannedCount}/7 planned
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-2">
            <button onClick={() => setWeekOffset(weekOffset - 1)}>
              <ChevronLeft className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-600">{weekLabel}</span>
            <button onClick={() => setWeekOffset(weekOffset + 1)}>
              <ChevronRight className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {DAYS.map((day, i) => {
            const date = weekDates[i];
            const planned = planner[date];
            const weather = MOCK_WEATHER[i];
            const WeatherIcon = weather.icon;
            const isToday = date === new Date().toISOString().split("T")[0];

            return (
              <motion.div
                key={date}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, ease: "easeOut" as const }}
                className={cn(
                  "flex items-center space-x-3 p-2 rounded-xl transition-colors",
                  isToday && "bg-primary/5 ring-1 ring-primary/20",
                  !isToday && "hover:bg-gray-50"
                )}
              >
                <div className="w-10 text-center">
                  <div className={cn("text-xs font-bold", isToday ? "text-primary" : "text-gray-600")}>{day}</div>
                  <div className="text-[10px] text-gray-400">
                    {new Date(date).getDate()}
                  </div>
                </div>

                <div className="flex items-center space-x-1 w-16 text-xs text-gray-400">
                  <WeatherIcon className="w-3.5 h-3.5" />
                  <span>{weather.temp}</span>
                </div>

                <div className="flex-1 min-w-0">
                  {planned ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-800 font-medium truncate">{planned.outfitName}</span>
                      <button onClick={() => handleClear(date)} className="text-gray-300 hover:text-gray-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300 italic">No outfit planned</span>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  {!planned && (
                    <>
                      <button
                        onClick={() => { setSelectedDate(date); setShowPicker(true); }}
                        className="p-1 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                        title="Pick outfit"
                      >
                        <Shirt className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSurpriseMe(date)}
                        className="p-1 rounded-lg text-gray-400 hover:text-secondary hover:bg-secondary/5 transition-colors"
                        title="Surprise me"
                      >
                        <Shuffle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Outfit Picker Dialog */}
      <Dialog open={showPicker} onOpenChange={setShowPicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Outfit for {selectedDate && new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
            {outfits.map((outfit) => (
              <button
                key={outfit.id}
                onClick={() => handleAssign(selectedDate, outfit.id)}
                className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                {outfit.ai_visualization_url && (
                  <img src={outfit.ai_visualization_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{outfit.name}</p>
                  <p className="text-xs text-gray-400">{outfit.items.length} pieces | {outfit.occasion}</p>
                </div>
                <Badge variant="outline" className="text-xs">{outfit.style_score}%</Badge>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
