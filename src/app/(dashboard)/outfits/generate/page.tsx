"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Cloud,
  Calendar,
  Thermometer,
  Wand2,
  ArrowLeft,
  ArrowRight,
  Heart,
  Save,
  Share2,
  Star,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store";
import { cn, OCCASION_LABELS } from "@/lib/utils";
import { Outfit } from "@/types";
import Link from "next/link";
import toast from "react-hot-toast";

const occasions = [
  { key: "casual", label: "Casual", emoji: "👋", desc: "Everyday laid-back style" },
  { key: "work", label: "Work", emoji: "💼", desc: "Professional & polished" },
  { key: "date_night", label: "Date Night", emoji: "💕", desc: "Romantic & alluring" },
  { key: "formal", label: "Formal", emoji: "🥂", desc: "Black-tie & elegant" },
  { key: "party", label: "Party", emoji: "🎉", desc: "Fun & festive" },
  { key: "athletic", label: "Athletic", emoji: "🏃", desc: "Active & sporty" },
  { key: "vacation", label: "Vacation", emoji: "✈️", desc: "Travel-ready" },
];

const weatherOptions = [
  { key: "sunny_warm", label: "Sunny & Warm (75-85°F)", icon: "☀️" },
  { key: "mild", label: "Mild & Pleasant (60-75°F)", icon: "🌤️" },
  { key: "cool", label: "Cool & Breezy (45-60°F)", icon: "🌥️" },
  { key: "cold", label: "Cold (30-45°F)", icon: "❄️" },
  { key: "rainy", label: "Rainy", icon: "🌧️" },
  { key: "snowy", label: "Snowy", icon: "🌨️" },
];

export default function GenerateOutfitPage() {
  const { closetItems, outfits, addOutfit } = useStore();
  const [step, setStep] = useState<"configure" | "generating" | "results">("configure");
  const [occasion, setOccasion] = useState("");
  const [weather, setWeather] = useState("");
  const [style, setStyle] = useState("balanced");
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [generatedOutfits, setGeneratedOutfits] = useState<Outfit[]>([]);

  const handleGenerate = () => {
    if (!occasion || !weather) {
      toast.error("Please select an occasion and weather");
      return;
    }
    setStep("generating");

    setTimeout(() => {
      const mockGenerated: Outfit[] = [
        {
          id: `gen-${Date.now()}-1`,
          user_id: "user-1",
          name: `${OCCASION_LABELS[occasion]} Look #1`,
          description: "A carefully curated combination that balances style and comfort for your selected occasion.",
          items: closetItems.slice(0, 4),
          item_ids: closetItems.slice(0, 4).map((i) => i.id),
          occasion: occasion as any,
          season: "fall",
          weather: weatherOptions.find((w) => w.key === weather)?.label || "",
          ai_generated: true,
          ai_visualization_url: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600",
          flat_lay_url: null,
          style_score: 94,
          is_favorite: false,
          created_at: new Date().toISOString(),
        },
        {
          id: `gen-${Date.now()}-2`,
          user_id: "user-1",
          name: `${OCCASION_LABELS[occasion]} Look #2`,
          description: "An alternative take featuring bold color combinations and mixed textures.",
          items: closetItems.slice(2, 6),
          item_ids: closetItems.slice(2, 6).map((i) => i.id),
          occasion: occasion as any,
          season: "fall",
          weather: weatherOptions.find((w) => w.key === weather)?.label || "",
          ai_generated: true,
          ai_visualization_url: "https://images.unsplash.com/photo-1502716119720-b23a1e3f2516?w=600",
          flat_lay_url: null,
          style_score: 91,
          is_favorite: false,
          created_at: new Date().toISOString(),
        },
        {
          id: `gen-${Date.now()}-3`,
          user_id: "user-1",
          name: `${OCCASION_LABELS[occasion]} Look #3`,
          description: "A minimalist approach with focus on clean lines and neutral tones.",
          items: closetItems.slice(4, 8),
          item_ids: closetItems.slice(4, 8).map((i) => i.id),
          occasion: occasion as any,
          season: "fall",
          weather: weatherOptions.find((w) => w.key === weather)?.label || "",
          ai_generated: true,
          ai_visualization_url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600",
          flat_lay_url: null,
          style_score: 88,
          is_favorite: false,
          created_at: new Date().toISOString(),
        },
        {
          id: `gen-${Date.now()}-4`,
          user_id: "user-1",
          name: `${OCCASION_LABELS[occasion]} Look #4`,
          description: "A statement outfit with eye-catching accessories and layered elements.",
          items: closetItems.slice(6, 10),
          item_ids: closetItems.slice(6, 10).map((i) => i.id),
          occasion: occasion as any,
          season: "fall",
          weather: weatherOptions.find((w) => w.key === weather)?.label || "",
          ai_generated: true,
          ai_visualization_url: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600",
          flat_lay_url: null,
          style_score: 86,
          is_favorite: false,
          created_at: new Date().toISOString(),
        },
        {
          id: `gen-${Date.now()}-5`,
          user_id: "user-1",
          name: `${OCCASION_LABELS[occasion]} Look #5`,
          description: "A trendy combination inspired by current fashion week highlights.",
          items: closetItems.slice(0, 3),
          item_ids: closetItems.slice(0, 3).map((i) => i.id),
          occasion: occasion as any,
          season: "fall",
          weather: weatherOptions.find((w) => w.key === weather)?.label || "",
          ai_generated: true,
          ai_visualization_url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600",
          flat_lay_url: null,
          style_score: 85,
          is_favorite: false,
          created_at: new Date().toISOString(),
        },
      ];
      setGeneratedOutfits(mockGenerated);
      setStep("results");
    }, 3000);
  };

  const currentOutfit = generatedOutfits[currentOutfitIndex];

  const handleSaveOutfit = () => {
    if (currentOutfit) {
      addOutfit(currentOutfit);
      toast.success("Outfit saved to your collection!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/outfits">
            <button className="p-2 rounded-xl hover:bg-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-sora font-bold flex items-center space-x-2">
              <Sparkles className="w-7 h-7 text-primary" />
              <span>AI Outfit Generator</span>
            </h1>
            <p className="text-gray-500">Let AI create the perfect outfit from your closet</p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center space-x-4 mb-10">
          {[
            { key: "configure", label: "Configure" },
            { key: "generating", label: "Generating" },
            { key: "results", label: "Results" },
          ].map((s, i) => (
            <React.Fragment key={s.key}>
              {i > 0 && <div className="w-12 h-0.5 bg-gray-200" />}
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    step === s.key
                      ? "bg-gradient-to-r from-primary to-secondary text-white"
                      : step === "results" && s.key === "configure"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  )}
                >
                  {i + 1}
                </div>
                <span className={cn("text-sm font-medium hidden sm:block", step === s.key ? "text-primary" : "text-gray-400")}>
                  {s.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Configure Step */}
        {step === "configure" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Occasion */}
            <div>
              <h2 className="font-sora font-semibold text-lg mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>What&apos;s the occasion?</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {occasions.map((occ) => (
                  <button
                    key={occ.key}
                    onClick={() => setOccasion(occ.key)}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-left transition-all",
                      occasion === occ.key
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-200 bg-white hover:border-primary/30"
                    )}
                  >
                    <span className="text-2xl mb-2 block">{occ.emoji}</span>
                    <p className="font-semibold text-sm">{occ.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{occ.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Weather */}
            <div>
              <h2 className="font-sora font-semibold text-lg mb-4 flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-primary" />
                <span>What&apos;s the weather like?</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {weatherOptions.map((w) => (
                  <button
                    key={w.key}
                    onClick={() => setWeather(w.key)}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-left transition-all",
                      weather === w.key
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-200 bg-white hover:border-primary/30"
                    )}
                  >
                    <span className="text-2xl mb-1 block">{w.icon}</span>
                    <p className="text-sm font-medium">{w.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Preference */}
            <div>
              <h2 className="font-sora font-semibold text-lg mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Style preference</span>
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: "minimal", label: "Minimal", desc: "Clean & simple" },
                  { key: "balanced", label: "Balanced", desc: "Best of both" },
                  { key: "bold", label: "Bold", desc: "Statement looks" },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setStyle(s.key)}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-center transition-all",
                      style === s.key
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-200 bg-white hover:border-primary/30"
                    )}
                  >
                    <p className="font-semibold text-sm">{s.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-4 flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-gray-600">
                AI will analyze your <strong>{closetItems.length} closet items</strong> and generate 5 outfit combinations optimized for your selections.
              </p>
            </div>

            <Button size="xl" className="w-full" onClick={handleGenerate}>
              <Wand2 className="w-5 h-5 mr-2" />
              Generate 5 Outfits
            </Button>
          </motion.div>
        )}

        {/* Generating Step */}
        {step === "generating" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-8 animate-pulse-glow">
              <Wand2 className="w-12 h-12 text-white animate-spin" style={{ animationDuration: "3s" }} />
            </div>
            <h2 className="text-2xl font-sora font-bold mb-3">Creating Your Perfect Outfits</h2>
            <p className="text-gray-500 mb-8">AI is analyzing your closet and creating 5 outfit combinations...</p>
            <div className="max-w-md mx-auto space-y-3">
              {[
                "Analyzing your closet items...",
                "Matching colors and patterns...",
                "Considering occasion & weather...",
                "Scoring style combinations...",
                "Generating visualizations...",
              ].map((text, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.5 }}
                  className="flex items-center space-x-3 text-left"
                >
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm text-gray-600">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Results Step */}
        {step === "results" && currentOutfit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Swipe Navigation */}
            <div className="flex items-center justify-between">
              <h2 className="font-sora font-semibold text-lg">
                Outfit {currentOutfitIndex + 1} of {generatedOutfits.length}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentOutfitIndex(Math.max(0, currentOutfitIndex - 1))}
                  disabled={currentOutfitIndex === 0}
                  className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex space-x-1">
                  {generatedOutfits.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentOutfitIndex(i)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        i === currentOutfitIndex ? "bg-primary w-6" : "bg-gray-300"
                      )}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentOutfitIndex(Math.min(generatedOutfits.length - 1, currentOutfitIndex + 1))}
                  disabled={currentOutfitIndex === generatedOutfits.length - 1}
                  className="p-2 rounded-xl bg-white border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentOutfit.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    <div className="aspect-[3/4] md:aspect-auto relative">
                      <img
                        src={currentOutfit.ai_visualization_url || ""}
                        alt={currentOutfit.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-primary to-secondary border-0 text-white">
                          <Star className="w-3 h-3 mr-1 fill-white" />
                          Style Score: {currentOutfit.style_score}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6 space-y-5">
                      <div>
                        <h3 className="font-sora text-2xl font-bold mb-2">{currentOutfit.name}</h3>
                        <p className="text-gray-500">{currentOutfit.description}</p>
                      </div>

                      <div className="flex space-x-3">
                        <Badge variant="pink">{OCCASION_LABELS[currentOutfit.occasion]}</Badge>
                        <Badge variant="outline">{currentOutfit.weather}</Badge>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-3">Items in this outfit</h4>
                        <div className="space-y-2">
                          {currentOutfit.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-3 p-2 rounded-xl bg-gray-50"
                            >
                              <img
                                src={item.thumbnail_url}
                                alt={item.brand}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.brand}</p>
                                <p className="text-xs text-gray-500 capitalize">{item.subcategory}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-3 pt-2">
                        <Button onClick={handleSaveOutfit} className="flex-1">
                          <Save className="w-4 h-4 mr-2" /> Save Outfit
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => toast.success("Generating DALL-E visualization...")}>
                          <ImageIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => toast.success("Shared!")}>
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => { setStep("configure"); setGeneratedOutfits([]); setCurrentOutfitIndex(0); }}>
                <RefreshCw className="w-4 h-4 mr-2" /> Generate New
              </Button>
              <Link href="/outfits">
                <Button variant="ghost">View All Outfits</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
