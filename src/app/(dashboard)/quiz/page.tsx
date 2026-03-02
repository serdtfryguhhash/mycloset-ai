"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Palette,
  Calendar,
  DollarSign,
  User,
  Shirt,
  Heart,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Footer from "@/components/layout/Footer";

// ── Quiz Data ──────────────────────────────────────────────────────────

interface QuizStep {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  type: "single" | "multi" | "single";
  options: QuizOption[];
}

interface QuizOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
  gradient: string;
}

const quizSteps: QuizStep[] = [
  {
    id: 1,
    title: "What's your style aesthetic?",
    subtitle: "Pick the vibe that speaks to you most",
    icon: Shirt,
    type: "single",
    options: [
      { id: "casual", label: "Casual", emoji: "👕", description: "Relaxed, comfy, everyday wear", gradient: "from-blue-400 to-cyan-400" },
      { id: "formal", label: "Formal", emoji: "👔", description: "Polished, elegant, structured", gradient: "from-gray-600 to-gray-800" },
      { id: "streetwear", label: "Streetwear", emoji: "🧢", description: "Bold, urban, trend-forward", gradient: "from-orange-500 to-red-500" },
      { id: "minimalist", label: "Minimalist", emoji: "🤍", description: "Clean lines, neutral tones, less is more", gradient: "from-stone-300 to-stone-500" },
      { id: "bohemian", label: "Bohemian", emoji: "🌸", description: "Free-spirited, flowy, eclectic", gradient: "from-amber-400 to-pink-400" },
      { id: "athleisure", label: "Athleisure", emoji: "🏃", description: "Sporty meets stylish", gradient: "from-green-400 to-emerald-500" },
      { id: "vintage", label: "Vintage", emoji: "🎞️", description: "Retro-inspired, timeless classics", gradient: "from-amber-600 to-yellow-500" },
      { id: "glam", label: "Glam", emoji: "✨", description: "Sparkly, bold, head-turning", gradient: "from-pink-500 to-purple-600" },
    ],
  },
  {
    id: 2,
    title: "What colors do you gravitate toward?",
    subtitle: "Select up to 3 of your favorite color palettes",
    icon: Palette,
    type: "multi",
    options: [
      { id: "neutrals", label: "Neutrals", emoji: "🤎", description: "Black, white, beige, gray", gradient: "from-stone-400 to-stone-600" },
      { id: "earth-tones", label: "Earth Tones", emoji: "🍂", description: "Olive, rust, tan, burgundy", gradient: "from-amber-700 to-orange-800" },
      { id: "pastels", label: "Pastels", emoji: "🌷", description: "Soft pink, lavender, mint", gradient: "from-pink-300 to-purple-300" },
      { id: "bold-brights", label: "Bold & Bright", emoji: "🌈", description: "Red, electric blue, yellow", gradient: "from-red-500 to-blue-500" },
      { id: "monochrome", label: "Monochrome", emoji: "🖤", description: "All-black or all-white looks", gradient: "from-gray-900 to-gray-700" },
      { id: "jewel-tones", label: "Jewel Tones", emoji: "💎", description: "Emerald, sapphire, ruby", gradient: "from-emerald-600 to-blue-700" },
    ],
  },
  {
    id: 3,
    title: "What's your primary occasion?",
    subtitle: "Where do you dress up for most?",
    icon: Calendar,
    type: "single",
    options: [
      { id: "everyday", label: "Everyday", emoji: "☀️", description: "Errands, coffee runs, casual hangs", gradient: "from-yellow-400 to-orange-400" },
      { id: "work", label: "Work / Office", emoji: "💼", description: "Professional settings, meetings", gradient: "from-blue-500 to-indigo-600" },
      { id: "date-night", label: "Date Night", emoji: "🌙", description: "Dinners, events, romantic outings", gradient: "from-pink-500 to-rose-600" },
      { id: "weekend", label: "Weekend Out", emoji: "🎉", description: "Brunch, shopping, night out", gradient: "from-purple-500 to-violet-600" },
      { id: "travel", label: "Travel", emoji: "✈️", description: "Airport-ready, versatile packing", gradient: "from-sky-400 to-blue-500" },
      { id: "fitness", label: "Fitness / Active", emoji: "💪", description: "Gym, yoga, outdoor activities", gradient: "from-green-500 to-teal-500" },
    ],
  },
  {
    id: 4,
    title: "What's your fashion budget?",
    subtitle: "No judgment -- just helps us tailor suggestions",
    icon: DollarSign,
    type: "single",
    options: [
      { id: "thrifty", label: "Thrifty", emoji: "🏷️", description: "Under $50 per piece -- thrift & fast fashion", gradient: "from-green-400 to-emerald-500" },
      { id: "moderate", label: "Moderate", emoji: "💳", description: "$50-$150 per piece -- quality basics", gradient: "from-blue-400 to-indigo-500" },
      { id: "premium", label: "Premium", emoji: "👜", description: "$150-$500 per piece -- designer-adjacent", gradient: "from-purple-500 to-pink-500" },
      { id: "luxury", label: "Luxury", emoji: "💎", description: "$500+ per piece -- high-end designer", gradient: "from-amber-400 to-yellow-500" },
      { id: "mix", label: "Mix & Match", emoji: "🎯", description: "Invest in staples, save on trends", gradient: "from-pink-400 to-orange-400" },
    ],
  },
  {
    id: 5,
    title: "What's your body type focus?",
    subtitle: "Helps us suggest the most flattering fits",
    icon: User,
    type: "single",
    options: [
      { id: "hourglass", label: "Hourglass", emoji: "⌛", description: "Balanced top & bottom, defined waist", gradient: "from-pink-400 to-rose-500" },
      { id: "pear", label: "Pear", emoji: "🍐", description: "Narrower shoulders, wider hips", gradient: "from-green-400 to-lime-500" },
      { id: "apple", label: "Apple", emoji: "🍎", description: "Fuller midsection, slimmer legs", gradient: "from-red-400 to-rose-500" },
      { id: "rectangle", label: "Rectangle", emoji: "📐", description: "Balanced proportions, less defined waist", gradient: "from-blue-400 to-indigo-500" },
      { id: "inverted", label: "Inverted Triangle", emoji: "🔻", description: "Broader shoulders, narrower hips", gradient: "from-purple-400 to-violet-500" },
      { id: "skip", label: "Prefer Not to Say", emoji: "🙂", description: "That's totally fine, we'll keep it general", gradient: "from-gray-400 to-gray-500" },
    ],
  },
];

// ── Style Recommendations Engine ──────────────────────────────────────

interface StyleRecommendation {
  title: string;
  description: string;
  pieces: string[];
  gradient: string;
  emoji: string;
}

function generateRecommendations(
  answers: Record<number, string[]>
): { styleName: string; tagline: string; recommendations: StyleRecommendation[]; colorPalette: string[]; styleIcon: string } {
  const aesthetic = answers[1]?.[0] || "casual";
  const colors = answers[2] || ["neutrals"];
  const occasion = answers[3]?.[0] || "everyday";
  const budget = answers[4]?.[0] || "moderate";

  const styleMap: Record<string, { name: string; tagline: string; icon: string }> = {
    casual: { name: "Effortless Cool", tagline: "You make laid-back look luxe", icon: "😎" },
    formal: { name: "Power Dresser", tagline: "Confidence is your best accessory", icon: "👑" },
    streetwear: { name: "Urban Edge", tagline: "The streets are your runway", icon: "🔥" },
    minimalist: { name: "Less is Luxe", tagline: "Simplicity is the ultimate sophistication", icon: "🤍" },
    bohemian: { name: "Free Spirit", tagline: "Your style dances to its own beat", icon: "🌻" },
    athleisure: { name: "Active Elegance", tagline: "From gym to brunch seamlessly", icon: "⚡" },
    vintage: { name: "Retro Revival", tagline: "Old soul, timeless style", icon: "🎬" },
    glam: { name: "Showstopper", tagline: "Born to stand out, never blend in", icon: "💫" },
  };

  const style = styleMap[aesthetic] || styleMap.casual;

  const colorPaletteMap: Record<string, string[]> = {
    neutrals: ["#1C1917", "#FAFAF9", "#D6D3D1", "#A8A29E"],
    "earth-tones": ["#92400E", "#B45309", "#78350F", "#451A03"],
    pastels: ["#FBCFE8", "#DDD6FE", "#A7F3D0", "#BFDBFE"],
    "bold-brights": ["#EF4444", "#3B82F6", "#EAB308", "#22C55E"],
    monochrome: ["#000000", "#374151", "#6B7280", "#FFFFFF"],
    "jewel-tones": ["#065F46", "#1E3A5F", "#831843", "#713F12"],
  };

  const palette = colors.flatMap((c) => colorPaletteMap[c] || colorPaletteMap.neutrals).slice(0, 6);

  const outfitsByAesthetic: Record<string, StyleRecommendation[]> = {
    casual: [
      { title: "Weekend Wander", description: "Perfect for coffee runs and casual outings", pieces: ["Oversized linen shirt", "Wide-leg jeans", "White sneakers", "Canvas tote"], gradient: "from-blue-400 to-cyan-400", emoji: "☕" },
      { title: "Laid-Back Friday", description: "Office-to-happy-hour ready", pieces: ["Knit polo", "Chinos", "Loafers", "Minimal watch"], gradient: "from-amber-400 to-orange-400", emoji: "🍻" },
      { title: "Park Picnic", description: "Easy, breezy, and photogenic", pieces: ["Cotton midi dress", "Denim jacket", "Espadrilles", "Straw bag"], gradient: "from-green-400 to-emerald-400", emoji: "🌳" },
    ],
    formal: [
      { title: "Boardroom Boss", description: "Command any meeting room", pieces: ["Tailored blazer", "Silk blouse", "Pencil skirt", "Pointed-toe pumps"], gradient: "from-gray-600 to-gray-800", emoji: "💼" },
      { title: "Gala Night", description: "Red carpet energy", pieces: ["Floor-length gown", "Statement earrings", "Clutch", "Strappy heels"], gradient: "from-purple-600 to-indigo-700", emoji: "🥂" },
      { title: "Business Elegant", description: "Sophisticated yet approachable", pieces: ["Cashmere turtleneck", "Wool trousers", "Leather belt", "Oxford shoes"], gradient: "from-stone-500 to-stone-700", emoji: "📊" },
    ],
    streetwear: [
      { title: "Hype Beast", description: "Drop day ready", pieces: ["Graphic hoodie", "Cargo pants", "Chunky sneakers", "Crossbody bag"], gradient: "from-orange-500 to-red-500", emoji: "🔥" },
      { title: "Skater Core", description: "Effortless street style", pieces: ["Oversized tee", "Baggy jeans", "Vans Old Skool", "Snapback cap"], gradient: "from-yellow-500 to-orange-500", emoji: "🛹" },
      { title: "Tech Wear", description: "Futuristic urban explorer", pieces: ["Utility vest", "Joggers", "Trail runners", "Sling bag"], gradient: "from-gray-700 to-gray-900", emoji: "🌃" },
    ],
    minimalist: [
      { title: "Clean Slate", description: "The power of simplicity", pieces: ["White button-down", "Black trousers", "Leather mules", "Simple gold necklace"], gradient: "from-stone-300 to-stone-500", emoji: "🤍" },
      { title: "Tonal Layers", description: "Monochromatic mastery", pieces: ["Cashmere crew neck", "Matching knit pants", "Slip-on sneakers", "Tote bag"], gradient: "from-gray-300 to-gray-500", emoji: "🪨" },
      { title: "Capsule Classic", description: "10 pieces, endless looks", pieces: ["Trench coat", "Straight-leg jeans", "Breton stripe top", "Ballet flats"], gradient: "from-beige-300 to-stone-400", emoji: "📦" },
    ],
    bohemian: [
      { title: "Festival Ready", description: "Dance in the meadow vibes", pieces: ["Maxi dress", "Fringe bag", "Ankle boots", "Layered necklaces"], gradient: "from-amber-400 to-pink-400", emoji: "🌸" },
      { title: "Artisan Market", description: "Handcrafted and unique", pieces: ["Embroidered blouse", "Linen pants", "Woven sandals", "Basket bag"], gradient: "from-orange-300 to-rose-400", emoji: "🎨" },
      { title: "Sunset Soiree", description: "Ethereal evening look", pieces: ["Wrap dress", "Kimono layer", "Strappy heels", "Tassel earrings"], gradient: "from-pink-400 to-purple-400", emoji: "🌅" },
    ],
    athleisure: [
      { title: "Studio to Street", description: "Yoga class to brunch", pieces: ["Matching set", "Cropped hoodie", "Clean trainers", "Belt bag"], gradient: "from-green-400 to-emerald-500", emoji: "🧘" },
      { title: "Run Club", description: "Performance meets fashion", pieces: ["Running jacket", "Leggings", "Performance sneakers", "Sports watch"], gradient: "from-blue-400 to-cyan-500", emoji: "🏃" },
      { title: "Recovery Day", description: "Comfy but make it cute", pieces: ["Oversized sweatshirt", "Joggers", "Slides", "Baseball cap"], gradient: "from-purple-400 to-pink-400", emoji: "☁️" },
    ],
    vintage: [
      { title: "70s Revival", description: "Groovy and gorgeous", pieces: ["Flared jeans", "Platform boots", "Crochet vest", "Round sunglasses"], gradient: "from-amber-600 to-yellow-500", emoji: "🕺" },
      { title: "90s Nostalgia", description: "Throwback perfection", pieces: ["Mom jeans", "Band tee", "Chunky boots", "Mini backpack"], gradient: "from-purple-500 to-blue-500", emoji: "📼" },
      { title: "Old Hollywood", description: "Timeless glamour", pieces: ["Silk midi skirt", "Cashmere cardigan", "Kitten heels", "Pearl earrings"], gradient: "from-rose-400 to-pink-500", emoji: "🎬" },
    ],
    glam: [
      { title: "Night Out", description: "Turn every head in the room", pieces: ["Sequin mini dress", "Strappy heels", "Crystal clutch", "Statement rings"], gradient: "from-pink-500 to-purple-600", emoji: "💃" },
      { title: "Red Carpet", description: "A-list energy", pieces: ["Satin gown", "Diamond studs", "Evening clutch", "Stilettos"], gradient: "from-red-500 to-rose-600", emoji: "⭐" },
      { title: "Power Glam", description: "Sparkle in the boardroom", pieces: ["Metallic blazer", "Silk cami", "Tailored pants", "Pointed heels"], gradient: "from-amber-400 to-pink-500", emoji: "✨" },
    ],
  };

  return {
    styleName: style.name,
    tagline: style.tagline,
    styleIcon: style.icon,
    recommendations: outfitsByAesthetic[aesthetic] || outfitsByAesthetic.casual,
    colorPalette: palette,
  };
}

// ── Component ─────────────────────────────────────────────────────────

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function StyleQuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [direction, setDirection] = useState(1);

  const step = quizSteps[currentStep];
  const progress = ((currentStep + 1) / quizSteps.length) * 100;
  const selectedForStep = answers[step?.id] || [];

  const handleSelect = (optionId: string) => {
    if (!step) return;

    if (step.type === "multi") {
      const current = answers[step.id] || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : current.length < 3
          ? [...current, optionId]
          : current;
      setAnswers({ ...answers, [step.id]: updated });
    } else {
      setAnswers({ ...answers, [step.id]: [optionId] });
      // Auto-advance for single-select after a short delay
      setTimeout(() => {
        if (currentStep < quizSteps.length - 1) {
          setDirection(1);
          setCurrentStep(currentStep + 1);
        } else {
          setIsComplete(true);
        }
      }, 400);
    }
  };

  const handleNext = () => {
    if (currentStep < quizSteps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsComplete(false);
    setDirection(1);
  };

  const results = isComplete ? generateRecommendations(answers) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="relative pt-24 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Badge variant="pink" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" /> Style Discovery
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-sora font-bold">
            {isComplete ? (
              <>Your Style DNA: <span className="gradient-text">{results?.styleName}</span></>
            ) : (
              <>Discover Your <span className="gradient-text">Style DNA</span></>
            )}
          </h1>
          {!isComplete && (
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              Take our 5-step quiz and unlock personalized outfit recommendations tailored just for you.
            </p>
          )}
        </div>
      </section>

      {/* Quiz Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        {!isComplete ? (
          <>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Step {currentStep + 1} of {quizSteps.length}
                </span>
                <span className="text-sm font-medium text-primary">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              >
                {/* Question Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-sora font-bold text-gray-900">
                    {step.title}
                  </h2>
                  <p className="text-gray-500 mt-1">{step.subtitle}</p>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {step.options.map((option) => {
                    const isSelected = selectedForStep.includes(option.id);
                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-md"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.gradient} flex items-center justify-center text-xl shrink-0`}
                        >
                          {option.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">{option.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {option.description}
                          </p>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0"
                          >
                            <Check className="w-3.5 h-3.5 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Navigation for multi-select steps */}
                {step.type === "multi" && (
                  <div className="flex items-center justify-between mt-8">
                    <Button
                      variant="ghost"
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      className="gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={selectedForStep.length === 0}
                      className="gap-2"
                    >
                      {currentStep === quizSteps.length - 1 ? "See Results" : "Continue"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Back button for single-select steps */}
                {step.type === "single" && currentStep > 0 && (
                  <div className="mt-8">
                    <Button variant="ghost" onClick={handleBack} className="gap-2">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          /* ── Results ─────────────────────────────────────────────── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Style Profile Card */}
            <Card className="p-8 mb-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
              <div className="relative">
                <div className="text-5xl mb-4">{results?.styleIcon}</div>
                <h2 className="text-3xl font-sora font-bold gradient-text mb-2">
                  {results?.styleName}
                </h2>
                <p className="text-gray-500 text-lg">{results?.tagline}</p>

                {/* Color Palette */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Your Color Palette
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {results?.colorPalette.map((color, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
                        className="w-10 h-10 rounded-xl shadow-md border border-white/50"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Style Tags */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {[
                    answers[1]?.[0],
                    ...(answers[2] || []),
                    answers[3]?.[0],
                  ]
                    .filter(Boolean)
                    .map((tag) => (
                      <Badge key={tag} variant="outline" className="capitalize">
                        {tag?.replace("-", " ")}
                      </Badge>
                    ))}
                </div>
              </div>
            </Card>

            {/* Outfit Recommendations */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Heart className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-sora font-bold">
                  Outfit Combinations For You
                </h3>
              </div>

              <div className="grid gap-4">
                {results?.recommendations.map((rec, i) => (
                  <motion.div
                    key={rec.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                  >
                    <Card className="p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${rec.gradient} flex items-center justify-center text-2xl shrink-0`}
                        >
                          {rec.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-sora font-semibold text-lg">
                              {rec.title}
                            </h4>
                            <div className="flex items-center gap-1 text-accent">
                              <Star className="w-4 h-4 fill-accent" />
                              <span className="text-sm font-medium">
                                {(88 + i * 3)}% match
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">
                            {rec.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {rec.pieces.map((piece) => (
                              <span
                                key={piece}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 text-xs font-medium text-gray-700"
                              >
                                <Shirt className="w-3 h-3 text-gray-400" />
                                {piece}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRestart} variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Retake Quiz
              </Button>
              <Link href="/closet">
                <Button className="gap-2 w-full sm:w-auto">
                  Start Building Your Closet
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  );
}
