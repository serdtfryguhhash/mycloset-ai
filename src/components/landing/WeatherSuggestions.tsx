"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  CloudSun,
  Wind,
  Thermometer,
  Shirt,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ── Weather Scenarios ─────────────────────────────────────────────────

interface WeatherScenario {
  id: string;
  condition: string;
  temperature: number;
  tempUnit: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  bgGradient: string;
  outfits: OutfitSuggestion[];
}

interface OutfitSuggestion {
  name: string;
  pieces: string[];
  emoji: string;
  matchScore: number;
}

const weatherScenarios: WeatherScenario[] = [
  {
    id: "sunny",
    condition: "Sunny & Warm",
    temperature: 82,
    tempUnit: "F",
    description: "Clear skies, perfect for light layers",
    icon: Sun,
    iconColor: "text-amber-500",
    bgGradient: "from-amber-50 to-orange-50",
    outfits: [
      {
        name: "Breezy Summer",
        pieces: ["Linen shirt", "Cotton shorts", "Sandals"],
        emoji: "☀️",
        matchScore: 96,
      },
      {
        name: "Outdoor Chic",
        pieces: ["Sundress", "Espadrilles", "Sun hat"],
        emoji: "🌻",
        matchScore: 94,
      },
      {
        name: "Casual Cool",
        pieces: ["Tank top", "High-waist skirt", "Sneakers"],
        emoji: "😎",
        matchScore: 91,
      },
    ],
  },
  {
    id: "rainy",
    condition: "Rainy Day",
    temperature: 58,
    tempUnit: "F",
    description: "Grab an umbrella and dress smart",
    icon: CloudRain,
    iconColor: "text-blue-500",
    bgGradient: "from-blue-50 to-slate-50",
    outfits: [
      {
        name: "Rain Ready",
        pieces: ["Trench coat", "Boots", "Waterproof bag"],
        emoji: "🌧️",
        matchScore: 97,
      },
      {
        name: "Cozy Layered",
        pieces: ["Turtleneck", "Raincoat", "Ankle boots"],
        emoji: "🧥",
        matchScore: 93,
      },
      {
        name: "Urban Storm",
        pieces: ["Hoodie", "Joggers", "Waterproof sneakers"],
        emoji: "🌂",
        matchScore: 89,
      },
    ],
  },
  {
    id: "cold",
    condition: "Cold & Crisp",
    temperature: 32,
    tempUnit: "F",
    description: "Bundle up in warm, cozy layers",
    icon: Snowflake,
    iconColor: "text-cyan-500",
    bgGradient: "from-cyan-50 to-blue-50",
    outfits: [
      {
        name: "Winter Luxe",
        pieces: ["Wool coat", "Cashmere scarf", "Leather boots"],
        emoji: "❄️",
        matchScore: 98,
      },
      {
        name: "Cozy Cabin",
        pieces: ["Puffer jacket", "Chunky knit", "Fleece-lined jeans"],
        emoji: "🏔️",
        matchScore: 95,
      },
      {
        name: "Nordic Chic",
        pieces: ["Turtleneck dress", "Tights", "Knee-high boots"],
        emoji: "🧣",
        matchScore: 92,
      },
    ],
  },
  {
    id: "cloudy",
    condition: "Partly Cloudy",
    temperature: 68,
    tempUnit: "F",
    description: "Mild weather, perfect for layering",
    icon: CloudSun,
    iconColor: "text-gray-500",
    bgGradient: "from-gray-50 to-stone-50",
    outfits: [
      {
        name: "Smart Casual",
        pieces: ["Light blazer", "Crew-neck tee", "Chinos"],
        emoji: "🌤️",
        matchScore: 95,
      },
      {
        name: "Transitional",
        pieces: ["Denim jacket", "Midi dress", "Low-top sneakers"],
        emoji: "🍃",
        matchScore: 92,
      },
      {
        name: "Effortless",
        pieces: ["Cardigan", "Straight jeans", "Loafers"],
        emoji: "✨",
        matchScore: 90,
      },
    ],
  },
  {
    id: "windy",
    condition: "Windy & Cool",
    temperature: 55,
    tempUnit: "F",
    description: "Secure your layers and skip the skirts",
    icon: Wind,
    iconColor: "text-teal-500",
    bgGradient: "from-teal-50 to-emerald-50",
    outfits: [
      {
        name: "Wind-Proof",
        pieces: ["Windbreaker", "Fitted pants", "Sturdy sneakers"],
        emoji: "💨",
        matchScore: 96,
      },
      {
        name: "Layered Up",
        pieces: ["Zip-up fleece", "Tapered joggers", "Trail shoes"],
        emoji: "🍂",
        matchScore: 93,
      },
      {
        name: "City Walker",
        pieces: ["Parka", "Knit sweater", "Chelsea boots"],
        emoji: "🚶",
        matchScore: 90,
      },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────

export default function WeatherSuggestions() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scenario = weatherScenarios[currentIndex];
  const WeatherIcon = scenario.icon;

  const cycleWeather = () => {
    setCurrentIndex((prev) => (prev + 1) % weatherScenarios.length);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="purple" className="mb-4">
            <Thermometer className="w-3 h-3 mr-1" /> Weather-Based
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-sora font-bold">
            Dress for the{" "}
            <span className="gradient-text">Weather</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Smart outfit suggestions based on today&apos;s forecast. Never overdress or underdress again.
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            {/* Weather Display Card */}
            <div className="max-w-4xl mx-auto mb-8">
              <Card
                className={`p-6 sm:p-8 bg-gradient-to-r ${scenario.bgGradient} border-0 shadow-lg`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" as const }}
                    >
                      <WeatherIcon
                        className={`w-16 h-16 sm:w-20 sm:h-20 ${scenario.iconColor}`}
                      />
                    </motion.div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl sm:text-5xl font-sora font-bold text-gray-900">
                          {scenario.temperature}°
                        </span>
                        <span className="text-lg text-gray-400">
                          {scenario.tempUnit}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-700 mt-1">
                        {scenario.condition}
                      </p>
                      <p className="text-sm text-gray-500">
                        {scenario.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={cycleWeather}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 hover:bg-white shadow-sm border border-gray-200/50 text-sm font-medium text-gray-700 transition-all hover:shadow-md group"
                  >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    Try Another Weather
                  </button>
                </div>
              </Card>
            </div>

            {/* Outfit Suggestions */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {scenario.outfits.map((outfit, i) => (
                <motion.div
                  key={outfit.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                >
                  <Card className="p-6 h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{outfit.emoji}</span>
                      <Badge variant="pink" className="text-[11px]">
                        {outfit.matchScore}% match
                      </Badge>
                    </div>
                    <h3 className="font-sora font-semibold text-lg mb-3">
                      {outfit.name}
                    </h3>
                    <div className="space-y-2">
                      {outfit.pieces.map((piece) => (
                        <div
                          key={piece}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <Shirt className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{piece}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Weather indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {weatherScenarios.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-primary w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
