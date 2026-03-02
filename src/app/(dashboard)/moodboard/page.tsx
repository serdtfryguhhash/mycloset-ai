"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon,
  Plus,
  Palette,
  Tag,
  StickyNote,
  X,
  Trash2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const MOODBOARD_KEY = "mycloset_moodboards";

interface MoodBoard {
  id: string;
  name: string;
  colorPalette: string[];
  styleNotes: string;
  referenceImages: string[];
  taggedItemIds: string[];
  createdAt: string;
}

function loadBoards(): MoodBoard[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(MOODBOARD_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveBoards(boards: MoodBoard[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOODBOARD_KEY, JSON.stringify(boards));
}

const PRESET_COLORS = [
  "#1C1917", "#FFFFFF", "#BE185D", "#7C3AED", "#F59E0B",
  "#22C55E", "#3B82F6", "#EC4899", "#8B5CF6", "#14B8A6",
  "#F97316", "#EF4444", "#A855F7", "#06B6D4", "#84CC16",
  "#D4A574", "#C19A6B", "#8B7355", "#E8C4A2", "#F5F5DC",
];

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400",
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function MoodBoardPage() {
  const { closetItems } = useStore();
  const [boards, setBoards] = useState<MoodBoard[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState<MoodBoard | null>(null);

  // Create form state
  const [newName, setNewName] = useState("");
  const [newColors, setNewColors] = useState<string[]>([]);
  const [newNotes, setNewNotes] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newTaggedItems, setNewTaggedItems] = useState<string[]>([]);

  useEffect(() => {
    setBoards(loadBoards());
  }, []);

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error("Please enter a board name");
      return;
    }
    if (newColors.length === 0) {
      toast.error("Select at least one color");
      return;
    }

    const board: MoodBoard = {
      id: `board-${Date.now()}`,
      name: newName.trim(),
      colorPalette: newColors.slice(0, 5),
      styleNotes: newNotes,
      referenceImages: newImages,
      taggedItemIds: newTaggedItems,
      createdAt: new Date().toISOString(),
    };

    const updated = [board, ...boards];
    saveBoards(updated);
    setBoards(updated);
    resetForm();
    setShowCreate(false);
    toast.success("Mood board created!");
  };

  const handleDelete = (id: string) => {
    const updated = boards.filter((b) => b.id !== id);
    saveBoards(updated);
    setBoards(updated);
    setShowDetail(null);
    toast.success("Board deleted");
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setNewImages([...newImages, newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const toggleColor = (color: string) => {
    if (newColors.includes(color)) {
      setNewColors(newColors.filter((c) => c !== color));
    } else if (newColors.length < 5) {
      setNewColors([...newColors, color]);
    }
  };

  const toggleTagItem = (itemId: string) => {
    if (newTaggedItems.includes(itemId)) {
      setNewTaggedItems(newTaggedItems.filter((id) => id !== itemId));
    } else {
      setNewTaggedItems([...newTaggedItems, itemId]);
    }
  };

  const resetForm = () => {
    setNewName("");
    setNewColors([]);
    setNewNotes("");
    setNewImageUrl("");
    setNewImages([]);
    setNewTaggedItems([]);
  };

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
              <Palette className="w-8 h-8 text-accent" />
              <span>Style Mood Boards</span>
            </h1>
            <p className="text-gray-500">Curate your personal style bible with inspiration boards</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="mt-4 sm:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            New Board
          </Button>
        </motion.div>

        {boards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-sora font-semibold text-gray-600 mb-2">Create Your First Mood Board</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Collect inspiration, define color palettes, and tag your closet items to create your personal style guide.
            </p>
            <Button onClick={() => setShowCreate(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Mood Board
            </Button>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board, i) => (
              <motion.div key={board.id} custom={i} initial="hidden" animate="visible" variants={fadeIn}>
                <Card
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setShowDetail(board)}
                >
                  {/* Color Banner */}
                  <div className="h-20 flex">
                    {board.colorPalette.map((color, ci) => (
                      <div
                        key={ci}
                        className="flex-1"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-sora font-semibold text-lg mb-1">{board.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{board.styleNotes || "No notes"}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <span className="flex items-center space-x-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>{board.referenceImages.length}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Tag className="w-3 h-3" />
                          <span>{board.taggedItemIds.length}</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {new Date(board.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Mood Board</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Board Name</label>
              <Input
                placeholder="e.g., Spring Capsule Vibes"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            {/* Color Palette */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Color Palette ({newColors.length}/5)
              </label>
              <div className="grid grid-cols-10 gap-1.5">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={cn(
                      "w-7 h-7 rounded-full border-2 transition-all",
                      newColors.includes(color)
                        ? "border-primary scale-110 ring-2 ring-primary/30"
                        : "border-gray-200 hover:scale-105"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {newColors.length > 0 && (
                <div className="flex mt-2 rounded-lg overflow-hidden h-8">
                  {newColors.map((color, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                  ))}
                </div>
              )}
            </div>

            {/* Style Notes */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Style Notes</label>
              <textarea
                placeholder="Describe the vibe, inspiration, keywords..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            {/* Reference Images */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Reference Images (URLs)</label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Paste image URL..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" variant="outline" onClick={addImage}>Add</Button>
              </div>
              <div className="flex space-x-1 mt-2 text-xs text-gray-400">
                <span>Quick add:</span>
                {SAMPLE_IMAGES.slice(0, 2).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setNewImages([...newImages, img])}
                    className="underline hover:text-primary"
                  >
                    Sample {i + 1}
                  </button>
                ))}
              </div>
              {newImages.length > 0 && (
                <div className="grid grid-cols-4 gap-1.5 mt-2">
                  {newImages.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setNewImages(newImages.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-0.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tag Closet Items */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Tag Closet Items</label>
              <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto">
                {closetItems.slice(0, 12).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleTagItem(item.id)}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                      newTaggedItems.includes(item.id)
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-transparent"
                    )}
                  >
                    <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    {newTaggedItems.includes(item.id) && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create Board
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {showDetail && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{showDetail.name}</DialogTitle>
                  <button
                    onClick={() => handleDelete(showDetail.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                {/* Palette */}
                <div className="flex rounded-xl overflow-hidden h-12">
                  {showDetail.colorPalette.map((color, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                  ))}
                </div>

                {/* Notes */}
                {showDetail.styleNotes && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-2 mb-1">
                      <StickyNote className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-600">Notes</span>
                    </div>
                    <p className="text-sm text-gray-600">{showDetail.styleNotes}</p>
                  </div>
                )}

                {/* Images */}
                {showDetail.referenceImages.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-gray-600 mb-2 block">Inspiration</span>
                    <div className="grid grid-cols-2 gap-2">
                      {showDetail.referenceImages.map((img, i) => (
                        <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tagged Items */}
                {showDetail.taggedItemIds.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-gray-600 mb-2 block">Tagged Items</span>
                    <div className="grid grid-cols-4 gap-2">
                      {showDetail.taggedItemIds.map((itemId) => {
                        const item = closetItems.find((ci) => ci.id === itemId);
                        if (!item) return null;
                        return (
                          <div key={itemId} className="aspect-square rounded-xl overflow-hidden">
                            <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
