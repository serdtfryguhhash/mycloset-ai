"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Shirt,
  Calendar as CalendarIcon,
  StickyNote,
  Sparkles,
  Trash2,
  Edit3,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/Footer";

// ── Types ─────────────────────────────────────────────────────────────

interface PlannedOutfit {
  id: string;
  name: string;
  pieces: string[];
  note: string;
  color: string;
}

interface DayData {
  outfits: PlannedOutfit[];
}

type CalendarData = Record<string, DayData>;

// ── Preset outfit templates ───────────────────────────────────────────

const outfitPresets = [
  { name: "Casual Friday", pieces: ["Denim jacket", "White tee", "Chinos", "Sneakers"], color: "bg-blue-500" },
  { name: "Business Meeting", pieces: ["Blazer", "Button-down", "Tailored pants", "Oxfords"], color: "bg-gray-700" },
  { name: "Date Night", pieces: ["Black dress", "Heels", "Statement earrings", "Clutch"], color: "bg-pink-500" },
  { name: "Weekend Brunch", pieces: ["Sundress", "Sandals", "Straw bag", "Sunglasses"], color: "bg-amber-500" },
  { name: "Gym Session", pieces: ["Sports bra", "Leggings", "Trainers", "Gym bag"], color: "bg-green-500" },
  { name: "Night Out", pieces: ["Sequin top", "Leather pants", "Boots", "Chain necklace"], color: "bg-purple-500" },
  { name: "WFH Cozy", pieces: ["Oversized sweater", "Joggers", "Fuzzy socks", "Scrunchie"], color: "bg-orange-400" },
  { name: "Travel Day", pieces: ["Comfy joggers", "Hoodie", "Slip-ons", "Carry-on bag"], color: "bg-sky-500" },
];

// ── Helpers ───────────────────────────────────────────────────────────

const STORAGE_KEY = "mycloset-calendar-data";

function getStorageData(): CalendarData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStorageData(data: CalendarData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Component ─────────────────────────────────────────────────────────

export default function OutfitCalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState<PlannedOutfit | null>(null);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [outfitName, setOutfitName] = useState("");
  const [outfitPieces, setOutfitPieces] = useState("");
  const [outfitNote, setOutfitNote] = useState("");
  const [outfitColor, setOutfitColor] = useState("bg-primary");

  const colorOptions = [
    "bg-primary", "bg-secondary", "bg-blue-500", "bg-green-500",
    "bg-amber-500", "bg-pink-500", "bg-purple-500", "bg-orange-500",
    "bg-sky-500", "bg-red-500",
  ];

  useEffect(() => {
    setCalendarData(getStorageData());
    setMounted(true);
  }, []);

  const persistData = useCallback((newData: CalendarData) => {
    setCalendarData(newData);
    saveStorageData(newData);
  }, []);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const navigateMonth = (dir: number) => {
    const newDate = new Date(currentYear, currentMonth + dir, 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDay(today.getDate());
  };

  const selectedDateKey = selectedDay
    ? formatDateKey(currentYear, currentMonth, selectedDay)
    : null;
  const selectedDayData = selectedDateKey ? calendarData[selectedDateKey] : null;

  const openAddModal = (preset?: typeof outfitPresets[0]) => {
    if (preset) {
      setOutfitName(preset.name);
      setOutfitPieces(preset.pieces.join(", "));
      setOutfitColor(preset.color);
      setOutfitNote("");
    } else {
      setOutfitName("");
      setOutfitPieces("");
      setOutfitNote("");
      setOutfitColor("bg-primary");
    }
    setEditingOutfit(null);
    setShowAddModal(true);
  };

  const openEditModal = (outfit: PlannedOutfit) => {
    setOutfitName(outfit.name);
    setOutfitPieces(outfit.pieces.join(", "));
    setOutfitNote(outfit.note);
    setOutfitColor(outfit.color);
    setEditingOutfit(outfit);
    setShowAddModal(true);
  };

  const handleSaveOutfit = () => {
    if (!selectedDateKey || !outfitName.trim()) return;

    const pieces = outfitPieces
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const newData = { ...calendarData };

    if (!newData[selectedDateKey]) {
      newData[selectedDateKey] = { outfits: [] };
    }

    if (editingOutfit) {
      newData[selectedDateKey].outfits = newData[selectedDateKey].outfits.map((o) =>
        o.id === editingOutfit.id
          ? { ...o, name: outfitName, pieces, note: outfitNote, color: outfitColor }
          : o
      );
    } else {
      newData[selectedDateKey].outfits.push({
        id: generateId(),
        name: outfitName,
        pieces,
        note: outfitNote,
        color: outfitColor,
      });
    }

    persistData(newData);
    setShowAddModal(false);
    setEditingOutfit(null);
  };

  const handleDeleteOutfit = (outfitId: string) => {
    if (!selectedDateKey) return;
    const newData = { ...calendarData };
    if (newData[selectedDateKey]) {
      newData[selectedDateKey].outfits = newData[selectedDateKey].outfits.filter(
        (o) => o.id !== outfitId
      );
      if (newData[selectedDateKey].outfits.length === 0) {
        delete newData[selectedDateKey];
      }
    }
    persistData(newData);
  };

  // Build calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative pt-24 pb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="pink" className="mb-3">
                <CalendarIcon className="w-3 h-3 mr-1" /> Outfit Planner
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-sora font-bold">
                Outfit <span className="gradient-text">Calendar</span>
              </h1>
              <p className="mt-2 text-gray-500">
                Plan your outfits ahead and never stress about what to wear.
              </p>
            </div>
            <Button onClick={goToToday} variant="outline" className="hidden sm:flex gap-2">
              <CalendarIcon className="w-4 h-4" /> Today
            </Button>
          </div>
        </div>
      </section>

      {/* Calendar Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-xl font-sora font-bold">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </h2>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAY_NAMES.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-gray-400 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="aspect-square" />;
                  }

                  const dateKey = formatDateKey(currentYear, currentMonth, day);
                  const dayOutfits = calendarData[dateKey]?.outfits || [];
                  const isToday = dateKey === todayKey;
                  const isSelected = day === selectedDay;

                  return (
                    <motion.button
                      key={dateKey}
                      onClick={() => setSelectedDay(day)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative aspect-square rounded-xl p-1 flex flex-col items-center justify-start transition-all duration-200 ${
                        isSelected
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : isToday
                            ? "bg-primary/10 text-primary ring-2 ring-primary/30"
                            : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span
                        className={`text-sm font-medium mt-1 ${
                          isSelected ? "text-white" : ""
                        }`}
                      >
                        {day}
                      </span>

                      {/* Outfit indicators */}
                      {dayOutfits.length > 0 && (
                        <div className="flex gap-0.5 mt-auto mb-1">
                          {dayOutfits.slice(0, 3).map((outfit) => (
                            <div
                              key={outfit.id}
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? "bg-white/80" : outfit.color
                              }`}
                            />
                          ))}
                          {dayOutfits.length > 3 && (
                            <span
                              className={`text-[8px] font-bold ${
                                isSelected ? "text-white/80" : "text-gray-400"
                              }`}
                            >
                              +{dayOutfits.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedDay ? (
                <motion.div
                  key={selectedDateKey}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-5">
                    {/* Selected Date Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {MONTH_NAMES[currentMonth]} {selectedDay}, {currentYear}
                        </p>
                        <h3 className="text-lg font-sora font-bold">
                          {selectedDayData?.outfits.length
                            ? `${selectedDayData.outfits.length} Outfit${selectedDayData.outfits.length > 1 ? "s" : ""} Planned`
                            : "No Outfits Planned"}
                        </h3>
                      </div>
                      <Button
                        size="icon"
                        onClick={() => openAddModal()}
                        className="rounded-xl h-9 w-9"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Planned Outfits */}
                    {selectedDayData?.outfits.map((outfit) => (
                      <motion.div
                        key={outfit.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${outfit.color}`}
                            />
                            <p className="font-semibold text-sm">
                              {outfit.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(outfit)}
                              className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                            <button
                              onClick={() => handleDeleteOutfit(outfit.id)}
                              className="p-1 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        </div>

                        {outfit.pieces.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {outfit.pieces.map((piece) => (
                              <span
                                key={piece}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-[10px] font-medium text-gray-600 border border-gray-100"
                              >
                                <Shirt className="w-2.5 h-2.5" />
                                {piece}
                              </span>
                            ))}
                          </div>
                        )}

                        {outfit.note && (
                          <div className="flex items-start gap-1.5 mt-2">
                            <StickyNote className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-gray-500">{outfit.note}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Quick Add from Presets */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Quick Add
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {outfitPresets.slice(0, 4).map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => openAddModal(preset)}
                            className="flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                          >
                            <div
                              className={`w-6 h-6 rounded-lg ${preset.color} flex items-center justify-center`}
                            >
                              <Shirt className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-medium text-gray-700 truncate">
                              {preset.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                    <CalendarIcon className="w-8 h-8 text-primary/40" />
                  </div>
                  <h3 className="font-sora font-semibold text-gray-700 mb-1">
                    Select a Day
                  </h3>
                  <p className="text-sm text-gray-400 max-w-[200px]">
                    Click on any day to plan outfits and add notes
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Upcoming Outfits Summary */}
        {Object.keys(calendarData).length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-sora font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Upcoming Planned Outfits
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(calendarData)
                .filter(([key]) => key >= todayKey)
                .sort(([a], [b]) => a.localeCompare(b))
                .slice(0, 6)
                .flatMap(([dateKey, data]) =>
                  data.outfits.map((outfit) => {
                    const [y, m, d] = dateKey.split("-").map(Number);
                    const date = new Date(y, m - 1, d);
                    return (
                      <Card
                        key={`${dateKey}-${outfit.id}`}
                        className="p-4 flex items-center gap-3"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl ${outfit.color} flex items-center justify-center shrink-0`}
                        >
                          <Shirt className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {outfit.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {date.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          {outfit.note && (
                            <p className="text-xs text-amber-600 truncate mt-0.5">
                              {outfit.note}
                            </p>
                          )}
                        </div>
                      </Card>
                    );
                  })
                )}
            </div>
          </div>
        )}
      </section>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 className="font-sora font-bold text-lg">
                  {editingOutfit ? "Edit Outfit" : "Plan an Outfit"}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                {/* Outfit Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Outfit Name
                  </label>
                  <input
                    type="text"
                    value={outfitName}
                    onChange={(e) => setOutfitName(e.target.value)}
                    placeholder="e.g., Business Meeting Look"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                {/* Pieces */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clothing Pieces
                  </label>
                  <input
                    type="text"
                    value={outfitPieces}
                    onChange={(e) => setOutfitPieces(e.target.value)}
                    placeholder="e.g., Blazer, White shirt, Chinos"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Separate items with commas
                  </p>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    value={outfitNote}
                    onChange={(e) => setOutfitNote(e.target.value)}
                    placeholder="e.g., Client presentation at 2pm"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Label Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setOutfitColor(color)}
                        className={`w-8 h-8 rounded-full ${color} flex items-center justify-center transition-transform ${
                          outfitColor === color
                            ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                            : "hover:scale-110"
                        }`}
                      >
                        {outfitColor === color && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 p-5 border-t border-gray-100">
                <Button
                  variant="ghost"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveOutfit}
                  disabled={!outfitName.trim()}
                  className="gap-2"
                >
                  <Check className="w-4 h-4" />
                  {editingOutfit ? "Save Changes" : "Add Outfit"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
