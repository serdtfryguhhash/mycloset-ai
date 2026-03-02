"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Clock,
  Users,
  ThumbsUp,
  Sparkles,
  Crown,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { mockUsers } from "@/lib/mock-data";
import { addXP } from "@/lib/gamification";
import toast from "react-hot-toast";

const CHALLENGE_STORAGE_KEY = "mycloset_weekly_challenges";

interface WeeklyTheme {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const THEME_POOL: WeeklyTheme[] = [
  { id: "monochrome", name: "Monochrome Week", description: "Create outfits using a single color family each day", icon: "🎨", color: "from-gray-600 to-gray-800" },
  { id: "shop-closet", name: "Shop Your Closet", description: "Create 7 new outfits using only items you already own", icon: "🛍️", color: "from-pink-500 to-rose-600" },
  { id: "color-block", name: "Color Block Challenge", description: "Mix and match bold, contrasting colors", icon: "🟩", color: "from-green-500 to-blue-600" },
  { id: "dress-up", name: "Dress Up Mon-Fri", description: "Elevate your daily outfits from Monday to Friday", icon: "👔", color: "from-indigo-500 to-violet-600" },
  { id: "accessories", name: "Accessories Focus", description: "Make accessories the star of every outfit", icon: "💎", color: "from-amber-500 to-orange-600" },
  { id: "sustainable", name: "Sustainable Style", description: "Wear only second-hand or sustainable brands", icon: "🌿", color: "from-green-400 to-emerald-600" },
  { id: "vintage", name: "Vintage Revival", description: "Channel your favorite decade through fashion", icon: "🕰️", color: "from-amber-600 to-yellow-500" },
  { id: "minimalist", name: "5-Piece Challenge", description: "Create 5 different outfits from just 5 pieces", icon: "✋", color: "from-slate-500 to-slate-700" },
  { id: "pattern-play", name: "Pattern Play", description: "Mix at least two patterns in every outfit", icon: "🔲", color: "from-purple-500 to-pink-600" },
  { id: "no-buy", name: "No-Buy Week", description: "Style amazing outfits without buying anything new", icon: "🚫", color: "from-red-500 to-rose-600" },
  { id: "uniform", name: "Work Uniform", description: "Create a signature work uniform you can repeat", icon: "👩‍💼", color: "from-blue-600 to-indigo-700" },
  { id: "athleisure", name: "Athleisure Everyday", description: "Make sporty pieces work for any occasion", icon: "🏃", color: "from-teal-500 to-cyan-600" },
  { id: "neutrals", name: "Neutrals Only", description: "Create stunning outfits using only neutral tones", icon: "🤎", color: "from-stone-400 to-stone-600" },
  { id: "bold-prints", name: "Bold Prints Week", description: "Feature a bold print in every daily outfit", icon: "🐆", color: "from-orange-500 to-red-500" },
  { id: "capsule", name: "Capsule Test", description: "Live with only 10 items for the week", icon: "📦", color: "from-violet-500 to-purple-700" },
  { id: "layers", name: "Layering Master", description: "Layer at least 3 pieces in every outfit", icon: "🧅", color: "from-cyan-500 to-blue-600" },
  { id: "thrift", name: "Thrift Flip", description: "Transform thrift finds into runway-worthy looks", icon: "♻️", color: "from-lime-500 to-green-600" },
  { id: "denim", name: "Denim on Denim", description: "Rock the Canadian tuxedo in creative ways", icon: "👖", color: "from-blue-400 to-blue-700" },
  { id: "formal-casual", name: "Formal Meets Casual", description: "Mix dressy and casual pieces in every outfit", icon: "🎭", color: "from-fuchsia-500 to-pink-600" },
  { id: "seasonal-transition", name: "Season Transition", description: "Create outfits that work between seasons", icon: "🍂", color: "from-orange-400 to-amber-700" },
];

interface ChallengeState {
  currentThemeId: string;
  weekStart: string;
  submitted: boolean;
  votedFor: string | null;
}

function loadState(): ChallengeState {
  if (typeof window === "undefined") {
    return { currentThemeId: THEME_POOL[0].id, weekStart: new Date().toISOString(), submitted: false, votedFor: null };
  }
  const stored = localStorage.getItem(CHALLENGE_STORAGE_KEY);
  if (!stored) {
    const state: ChallengeState = {
      currentThemeId: THEME_POOL[Math.floor(Math.random() * THEME_POOL.length)].id,
      weekStart: new Date().toISOString(),
      submitted: false,
      votedFor: null,
    };
    localStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify(state));
    return state;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return { currentThemeId: THEME_POOL[0].id, weekStart: new Date().toISOString(), submitted: false, votedFor: null };
  }
}

function saveState(state: ChallengeState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify(state));
}

const mockParticipants = [
  { user: mockUsers[1], votes: 42, imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=300" },
  { user: mockUsers[2], votes: 38, imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300" },
  { user: mockUsers[3], votes: 35, imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300" },
  { user: mockUsers[4], votes: 51, imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300" },
];

export default function WeeklyChallenge() {
  const [state, setState] = useState<ChallengeState>(loadState);
  const theme = THEME_POOL.find((t) => t.id === state.currentThemeId) || THEME_POOL[0];

  const daysLeft = Math.max(0, 7 - Math.floor((Date.now() - new Date(state.weekStart).getTime()) / 86400000));
  const progress = Math.round(((7 - daysLeft) / 7) * 100);

  const handleSubmit = () => {
    const newState = { ...state, submitted: true };
    saveState(newState);
    setState(newState);
    addXP("complete_challenge");
    toast.success("Challenge submitted! +50 XP");
  };

  const handleVote = (userName: string) => {
    const newState = { ...state, votedFor: userName };
    saveState(newState);
    setState(newState);
    toast.success(`Voted for ${userName}!`);
  };

  // Winner (most votes)
  const sortedParticipants = [...mockParticipants].sort((a, b) => b.votes - a.votes);

  return (
    <Card className="overflow-hidden">
      <div className={cn("p-4 bg-gradient-to-r text-white", theme.color)}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide opacity-90">Weekly Challenge</span>
            </div>
            <h3 className="text-xl font-sora font-bold">
              {theme.icon} {theme.name}
            </h3>
            <p className="text-sm opacity-80 mt-1">{theme.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-sm opacity-80">
              <Clock className="w-4 h-4" />
              <span>{daysLeft}d left</span>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs opacity-70 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white/80 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      <CardContent className="pt-4 space-y-4">
        {/* Participants */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Top Entries</span>
            <Badge variant="outline" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              {mockParticipants.length + 46} entries
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {sortedParticipants.slice(0, 4).map((p, i) => (
              <motion.div
                key={p.user.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-xl overflow-hidden group"
              >
                <img src={p.imageUrl} alt="" className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {i === 0 && (
                  <div className="absolute top-2 right-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="flex items-center space-x-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={p.user.avatar_url} />
                      <AvatarFallback className="text-[8px]">{p.user.display_name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] text-white font-medium truncate">{p.user.display_name}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-white/70 flex items-center">
                      <ThumbsUp className="w-3 h-3 mr-0.5" /> {p.votes}
                    </span>
                    <button
                      onClick={() => handleVote(p.user.display_name)}
                      disabled={state.votedFor === p.user.display_name}
                      className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full transition-all",
                        state.votedFor === p.user.display_name
                          ? "bg-white/20 text-white/50"
                          : "bg-white/30 text-white hover:bg-white/50"
                      )}
                    >
                      {state.votedFor === p.user.display_name ? "Voted" : "Vote"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button
          className="w-full"
          size="sm"
          onClick={handleSubmit}
          disabled={state.submitted}
        >
          {state.submitted ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Submitted
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Submit Entry (+50 XP)
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
