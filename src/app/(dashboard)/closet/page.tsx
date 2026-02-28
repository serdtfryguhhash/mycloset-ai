"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Grid,
  LayoutGrid,
  Heart,
  Tag,
  Shirt,
  Upload,
  X,
  Sparkles,
  Camera,
  Wand2,
  BarChart3,
  Eye,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store";
import { cn, CATEGORY_ICONS, formatCurrency } from "@/lib/utils";
import { ClothingItem, ClothingCategory } from "@/types";
import toast from "react-hot-toast";

const categories: { key: string; label: string; icon: string }[] = [
  { key: "all", label: "All Items", icon: "✨" },
  { key: "tops", label: "Tops", icon: "👕" },
  { key: "bottoms", label: "Bottoms", icon: "👖" },
  { key: "dresses", label: "Dresses", icon: "👗" },
  { key: "outerwear", label: "Outerwear", icon: "🧥" },
  { key: "shoes", label: "Shoes", icon: "👟" },
  { key: "bags", label: "Bags", icon: "👜" },
  { key: "accessories", label: "Accessories", icon: "🎒" },
  { key: "jewelry", label: "Jewelry", icon: "💍" },
];

export default function ClosetPage() {
  const { closetItems, toggleItemFavorite, addClothingItem, removeClothingItem, selectedCategory, setSelectedCategory } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showItemDetail, setShowItemDetail] = useState<ClothingItem | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [uploadStep, setUploadStep] = useState<"upload" | "analyzing" | "results">("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");

  const filteredItems = closetItems
    .filter((item) => selectedCategory === "all" || item.category === selectedCategory)
    .filter(
      (item) =>
        searchQuery === "" ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ai_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.style_tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === "most_worn") return b.wear_count - a.wear_count;
    if (sortBy === "price_high") return b.price - a.price;
    if (sortBy === "price_low") return a.price - b.price;
    if (sortBy === "favorites") return (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0);
    return 0;
  });

  const totalValue = closetItems.reduce((sum, item) => sum + item.price, 0);
  const favoriteCount = closetItems.filter((i) => i.is_favorite).length;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setUploadStep("analyzing");
        setTimeout(() => setUploadStep("results"), 3000);
      };
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
  });

  const handleAddItem = () => {
    const newItem: ClothingItem = {
      id: `item-${Date.now()}`,
      user_id: "user-1",
      image_url: uploadedImage || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
      thumbnail_url: uploadedImage || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200",
      category: "tops",
      subcategory: "blouse",
      brand: "AI Detected",
      color: ["white"],
      pattern: "solid",
      material: "cotton",
      season: ["all"],
      occasion: ["casual"],
      style_tags: ["modern", "clean"],
      purchase_url: "",
      affiliate_url: "",
      price: 0,
      ai_description: "AI-detected clothing item",
      is_favorite: false,
      wear_count: 0,
      last_worn: null,
      created_at: new Date().toISOString(),
    };
    addClothingItem(newItem);
    setShowUploadModal(false);
    setUploadStep("upload");
    setUploadedImage(null);
    toast.success("Item added to your closet!");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-sora font-bold mb-1">My Closet</h1>
            <p className="text-gray-500">Manage your digital wardrobe</p>
          </div>
          <Button onClick={() => setShowUploadModal(true)} className="mt-4 sm:mt-0">
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Items", value: closetItems.length, icon: Shirt, color: "text-primary" },
            { label: "Total Value", value: formatCurrency(totalValue), icon: Tag, color: "text-secondary" },
            { label: "Favorites", value: favoriteCount, icon: Heart, color: "text-red-500" },
            { label: "Categories", value: new Set(closetItems.map((i) => i.category)).size, icon: Grid, color: "text-accent" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={cn("w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center", stat.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-sora font-bold">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search items, brands, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="most_worn">Most Worn</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="favorites">Favorites First</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn("p-2 rounded-md", viewMode === "grid" ? "bg-primary/10 text-primary" : "text-gray-400")}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn("p-2 rounded-md", viewMode === "list" ? "bg-primary/10 text-primary" : "text-gray-400")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex space-x-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={cn(
                "flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === cat.key
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30"
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {cat.key !== "all" && (
                <span className="text-xs opacity-70">
                  ({closetItems.filter((i) => i.category === cat.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              : "grid grid-cols-1 sm:grid-cols-2 gap-4"
          )}
        >
          {sortedItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="group"
            >
              <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => setShowItemDetail(item)}>
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.ai_description}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItemFavorite(item.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm"
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4 transition-colors",
                        item.is_favorite ? "fill-red-500 text-red-500" : "text-gray-600"
                      )}
                    />
                  </button>
                  {item.wear_count > 0 && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="default" className="bg-black/50 text-white text-[10px] backdrop-blur-sm">
                        Worn {item.wear_count}x
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm truncate">{item.brand}</p>
                  <p className="text-xs text-gray-500 truncate">{item.subcategory}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-semibold text-primary">
                      {item.price > 0 ? formatCurrency(item.price) : "No price"}
                    </span>
                    <div className="flex space-x-0.5">
                      {item.color.slice(0, 3).map((c, ci) => (
                        <div
                          key={ci}
                          className="w-3 h-3 rounded-full border border-gray-200"
                          style={{ backgroundColor: c === "cream" ? "#FFFDD0" : c === "oatmeal" ? "#D2B48C" : c === "caramel" ? "#A0522D" : c === "indigo" ? "#4B0082" : c === "sage" ? "#9DC183" : c === "nude" ? "#F5D5C8" : c === "tan" ? "#D2B48C" : c === "gold" ? "#FFD700" : c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {sortedItems.length === 0 && (
          <div className="text-center py-20">
            <Shirt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery ? "Try a different search term" : "Start building your closet by adding items"}
            </p>
            <Button onClick={() => setShowUploadModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Your First Item
            </Button>
          </div>
        )}

        {/* Upload Modal */}
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Add to Closet</span>
              </DialogTitle>
              <DialogDescription>
                Upload a photo and let AI analyze your clothing item
              </DialogDescription>
            </DialogHeader>

            {uploadStep === "upload" && (
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                )}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <p className="font-medium text-gray-700 mb-1">
                  {isDragActive ? "Drop your photo here" : "Drag & drop a photo"}
                </p>
                <p className="text-sm text-gray-400">or click to browse (JPG, PNG, WebP)</p>
              </div>
            )}

            {uploadStep === "analyzing" && (
              <div className="py-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                  <Wand2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <h3 className="font-sora font-semibold text-lg mb-2">AI is analyzing your item...</h3>
                <p className="text-gray-500 text-sm">Detecting category, colors, brand, and style</p>
                <div className="mt-6 space-y-2">
                  {["Detecting clothing type...", "Analyzing colors...", "Identifying brand...", "Generating style tags..."].map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.7 }}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-gray-600">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {uploadStep === "results" && (
              <div className="space-y-4">
                <div className="flex space-x-4">
                  {uploadedImage && (
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-32 h-32 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 font-medium">Category</label>
                      <p className="text-sm font-semibold">Tops - Blouse</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium">Brand</label>
                      <p className="text-sm font-semibold">Detected: Zara</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium">Colors</label>
                      <div className="flex space-x-1 mt-1">
                        <div className="w-5 h-5 rounded-full bg-white border-2 border-gray-200" />
                        <div className="w-5 h-5 rounded-full bg-gray-100 border-2 border-gray-200" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-medium">AI Description</label>
                  <p className="text-sm text-gray-700 mt-1">
                    Elegant cream silk blouse with relaxed fit, suitable for work and casual occasions.
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-medium">Style Tags</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {["elegant", "classic", "versatile", "silk", "cream"].map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => { setUploadStep("upload"); setUploadedImage(null); }}>
                    Re-upload
                  </Button>
                  <Button className="flex-1" onClick={handleAddItem}>
                    Add to Closet
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Item Detail Modal */}
        <Dialog open={!!showItemDetail} onOpenChange={() => setShowItemDetail(null)}>
          <DialogContent className="sm:max-w-2xl">
            {showItemDetail && (
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src={showItemDetail.image_url}
                    alt={showItemDetail.ai_description}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-sora text-xl font-bold">{showItemDetail.brand}</h3>
                    <p className="text-gray-500 capitalize">{showItemDetail.subcategory}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-primary">
                      {showItemDetail.price > 0 ? formatCurrency(showItemDetail.price) : "No price"}
                    </span>
                    <Badge variant="pink">{showItemDetail.category}</Badge>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">{showItemDetail.ai_description}</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Worn</p>
                      <p className="font-semibold">{showItemDetail.wear_count} times</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">Material</p>
                      <p className="font-semibold capitalize">{showItemDetail.material}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1.5">Style Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {showItemDetail.style_tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs capitalize">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1.5">Seasons</p>
                    <div className="flex flex-wrap gap-1.5">
                      {showItemDetail.season.map((s) => (
                        <Badge key={s} variant="purple" className="text-xs capitalize">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        toggleItemFavorite(showItemDetail.id);
                        setShowItemDetail({ ...showItemDetail, is_favorite: !showItemDetail.is_favorite });
                      }}
                    >
                      <Heart className={cn("w-4 h-4 mr-2", showItemDetail.is_favorite ? "fill-red-500 text-red-500" : "")} />
                      {showItemDetail.is_favorite ? "Unfavorite" : "Favorite"}
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        removeClothingItem(showItemDetail.id);
                        setShowItemDetail(null);
                        toast.success("Item removed");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
