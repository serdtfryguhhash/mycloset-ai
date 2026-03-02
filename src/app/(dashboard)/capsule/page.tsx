"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Sparkles,
  Check,
  X,
  AlertCircle,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/store";
import { cn, formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

const CAPSULE_KEY = "mycloset_capsule";

interface CapsuleResult {
  essential: { itemId: string; reason: string }[];
  extras: { itemId: string; reason: string }[];
  gaps: { category: string; description: string }[];
  summary: string;
}

function loadCapsule(): CapsuleResult | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(CAPSULE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function saveCapsule(data: CapsuleResult) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CAPSULE_KEY, JSON.stringify(data));
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function CapsulePage() {
  const { closetItems } = useStore();
  const [result, setResult] = useState<CapsuleResult | null>(loadCapsule);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"essential" | "extras" | "gaps">("essential");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/capsule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: closetItems.map((item) => ({
            id: item.id,
            category: item.category,
            subcategory: item.subcategory,
            brand: item.brand,
            color: item.color,
            season: item.season,
            occasion: item.occasion,
            wearCount: item.wear_count,
            price: item.price,
            material: item.material,
            styleTags: item.style_tags,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to generate capsule");

      const data = await res.json();
      saveCapsule(data);
      setResult(data);
      toast.success("Capsule wardrobe generated!");
    } catch {
      toast.error("Failed to generate capsule. Using sample data.");
      // Fallback to mock data
      const mockResult: CapsuleResult = {
        essential: closetItems.slice(0, 12).map((item) => ({
          itemId: item.id,
          reason: `Essential ${item.category} - versatile ${item.color.join("/")} ${item.subcategory} that pairs with multiple items`,
        })),
        extras: closetItems.slice(12).map((item) => ({
          itemId: item.id,
          reason: `Nice to have but overlaps with other ${item.category} in your capsule`,
        })),
        gaps: [
          { category: "outerwear", description: "A lightweight layering jacket for transitional weather" },
          { category: "shoes", description: "A pair of comfortable white sneakers for casual outfits" },
          { category: "accessories", description: "A structured crossbody bag in a neutral tone" },
        ],
        summary: "Your wardrobe has a strong foundation of classic pieces. Focus on filling gaps in transitional outerwear and versatile accessories to maximize outfit combinations.",
      };
      saveCapsule(mockResult);
      setResult(mockResult);
    } finally {
      setLoading(false);
    }
  };

  const capsuleTarget = 30;
  const essentialCount = result?.essential.length || 0;
  const progressPct = Math.min(100, Math.round((essentialCount / capsuleTarget) * 100));

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
              <Package className="w-8 h-8 text-secondary" />
              <span>Capsule Wardrobe Builder</span>
            </h1>
            <p className="text-gray-500">AI-curated essential pieces from your existing wardrobe</p>
          </div>
          <Button onClick={handleGenerate} disabled={loading} className="mt-4 sm:mt-0">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {result ? "Regenerate" : "Generate Capsule"}
              </>
            )}
          </Button>
        </motion.div>

        {!result ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-sora font-semibold text-gray-600 mb-2">Build Your Capsule Wardrobe</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              AI will analyze your {closetItems.length} items and recommend 30 essential pieces
              that maximize outfit combinations.
            </p>
            <Button onClick={handleGenerate} disabled={loading} size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Analyze My Closet
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Progress */}
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-sora font-semibold">Capsule Progress</h3>
                  <Badge variant="pink">{essentialCount}/{capsuleTarget} items</Badge>
                </div>
                <Progress value={progressPct} className="h-3" />
                <p className="text-xs text-gray-400 mt-2">{result.summary}</p>
              </Card>
            </motion.div>

            {/* Tabs */}
            <div className="flex space-x-2">
              {[
                { key: "essential" as const, label: "Essential", count: result.essential.length, icon: Check, color: "text-green-500" },
                { key: "extras" as const, label: "Extras", count: result.extras.length, icon: X, color: "text-gray-400" },
                { key: "gaps" as const, label: "Gaps to Fill", count: result.gaps.length, icon: AlertCircle, color: "text-amber-500" },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                      activeTab === tab.key
                        ? "bg-white shadow-sm border border-gray-100 text-gray-900"
                        : "text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", tab.color)} />
                    <span>{tab.label}</span>
                    <span className="text-xs text-gray-400">({tab.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            {activeTab === "essential" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.essential.map((entry, i) => {
                  const item = closetItems.find((ci) => ci.id === entry.itemId);
                  if (!item) return null;
                  return (
                    <motion.div key={entry.itemId} custom={i} initial="hidden" animate="visible" variants={fadeIn}>
                      <Card className="overflow-hidden border-green-200/50">
                        <div className="relative">
                          <img src={item.image_url} alt={item.subcategory} className="w-full h-48 object-cover" />
                          <div className="absolute top-2 right-2">
                            <Badge variant="success" className="text-xs">Essential</Badge>
                          </div>
                        </div>
                        <CardContent className="pt-3">
                          <p className="text-sm font-semibold text-gray-800">{item.brand} {item.subcategory}</p>
                          <p className="text-xs text-gray-500 capitalize">{item.color.join(", ")} | {item.category}</p>
                          <p className="text-xs text-gray-400 mt-2">{entry.reason}</p>
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                            <span>{item.wear_count} wears</span>
                            <span>{formatCurrency(item.price)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {activeTab === "extras" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.extras.map((entry, i) => {
                  const item = closetItems.find((ci) => ci.id === entry.itemId);
                  if (!item) return null;
                  return (
                    <motion.div key={entry.itemId} custom={i} initial="hidden" animate="visible" variants={fadeIn}>
                      <Card className="overflow-hidden opacity-80">
                        <div className="relative">
                          <img src={item.image_url} alt={item.subcategory} className="w-full h-48 object-cover grayscale-[30%]" />
                          <div className="absolute top-2 right-2">
                            <Badge variant="outline" className="text-xs bg-white">Extra</Badge>
                          </div>
                        </div>
                        <CardContent className="pt-3">
                          <p className="text-sm font-semibold text-gray-800">{item.brand} {item.subcategory}</p>
                          <p className="text-xs text-gray-500 capitalize">{item.color.join(", ")} | {item.category}</p>
                          <p className="text-xs text-gray-400 mt-2">{entry.reason}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {activeTab === "gaps" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.gaps.map((gap, i) => (
                  <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={fadeIn}>
                    <Card className="p-5 border-dashed border-2 border-amber-200 bg-amber-50/30">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 capitalize">{gap.category}</p>
                          <p className="text-xs text-gray-500 mt-1">{gap.description}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
