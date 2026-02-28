"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, Users, ThumbsUp, Clock, Crown, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useStore } from "@/store";
import { cn, formatNumber } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ChallengesPage() {
  const { challenges } = useStore();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? challenges : challenges.filter((c) => c.status === filter);

  const statusColors = {
    active: "bg-green-500",
    upcoming: "bg-blue-500",
    voting: "bg-amber-500",
    completed: "bg-gray-500",
  };

  const statusLabels = {
    active: "Active",
    upcoming: "Upcoming",
    voting: "Voting",
    completed: "Completed",
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-sora font-bold mb-1 flex items-center space-x-2">
              <Trophy className="w-8 h-8 text-accent" />
              <span>Style Challenges</span>
            </h1>
            <p className="text-gray-500">Compete, vote, and win amazing prizes</p>
          </div>
        </div>

        {/* Featured Challenge Banner */}
        {challenges.filter((c) => c.status === "active")[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden mb-8"
          >
            <img
              src={challenges[0].cover_image}
              alt={challenges[0].title}
              className="w-full h-64 sm:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center p-8 sm:p-12">
              <div className="max-w-lg">
                <Badge className="bg-green-500 border-0 text-white mb-4">
                  <Sparkles className="w-3 h-3 mr-1" /> Active Now
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-sora font-bold text-white mb-3">
                  {challenges[0].title}
                </h2>
                <p className="text-white/80 mb-4 line-clamp-2">{challenges[0].description}</p>
                <div className="flex items-center space-x-6 text-white/70 text-sm mb-6">
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{challenges[0].entry_count} entries</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>{challenges[0].prize_description}</span>
                  </span>
                </div>
                <Button
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => toast.success("Entry submitted!")}
                >
                  Enter Challenge
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex space-x-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
          {["all", "active", "upcoming", "voting", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all capitalize",
                filter === f
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200"
              )}
            >
              {f === "all" ? "All Challenges" : f}
            </button>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((challenge, i) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={challenge.cover_image}
                    alt={challenge.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className={cn("absolute top-3 left-3 border-0 text-white", statusColors[challenge.status])}>
                    {statusLabels[challenge.status]}
                  </Badge>
                  {challenge.winner && (
                    <div className="absolute bottom-3 left-3 flex items-center space-x-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <Crown className="w-4 h-4 text-accent" />
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={challenge.winner.avatar_url} />
                        <AvatarFallback>{challenge.winner.display_name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-white text-xs font-medium">
                        {challenge.winner.display_name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-sora font-semibold text-xl mb-2">{challenge.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{challenge.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{formatNumber(challenge.entry_count)} entries</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{formatNumber(challenge.vote_count)} votes</span>
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Trophy className="w-4 h-4 text-accent" />
                      <span className="font-medium text-gray-700">{challenge.prize_description}</span>
                    </div>
                  </div>

                  {challenge.status === "active" && (
                    <Button className="w-full" onClick={() => toast.success("Entry submitted!")}>
                      Enter Challenge
                    </Button>
                  )}
                  {challenge.status === "voting" && (
                    <Button variant="accent" className="w-full" onClick={() => toast.success("Vote cast!")}>
                      <ThumbsUp className="w-4 h-4 mr-2" /> Vote Now
                    </Button>
                  )}
                  {challenge.status === "upcoming" && (
                    <Button variant="outline" className="w-full">
                      <Clock className="w-4 h-4 mr-2" /> Remind Me
                    </Button>
                  )}
                  {challenge.status === "completed" && (
                    <Button variant="ghost" className="w-full">
                      View Results
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
