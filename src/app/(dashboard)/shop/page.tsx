"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ShoppingBag, ExternalLink, Star, Heart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatCurrency } from "@/lib/utils";

const shopItems = [
  { id: "shop-1", name: "Oversized Blazer", brand: "Zara", price: 89.90, originalPrice: 129.90, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400", category: "Outerwear", rating: 4.8, reviews: 234, trending: true, affiliateUrl: "#" },
  { id: "shop-2", name: "Leather Mini Skirt", brand: "AllSaints", price: 178.00, originalPrice: null, image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400", category: "Bottoms", rating: 4.6, reviews: 156, trending: false, affiliateUrl: "#" },
  { id: "shop-3", name: "Cashmere Sweater", brand: "COS", price: 175.00, originalPrice: null, image: "https://images.unsplash.com/photo-1434389677669-e08b4cda3f78?w=400", category: "Tops", rating: 4.9, reviews: 312, trending: true, affiliateUrl: "#" },
  { id: "shop-4", name: "Platform Sneakers", brand: "Nike", price: 130.00, originalPrice: null, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400", category: "Shoes", rating: 4.7, reviews: 891, trending: true, affiliateUrl: "#" },
  { id: "shop-5", name: "Silk Midi Dress", brand: "Reformation", price: 218.00, originalPrice: 298.00, image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=400", category: "Dresses", rating: 4.8, reviews: 178, trending: false, affiliateUrl: "#" },
  { id: "shop-6", name: "Chain Crossbody Bag", brand: "Bottega Veneta", price: 2950.00, originalPrice: null, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400", category: "Bags", rating: 4.9, reviews: 89, trending: false, affiliateUrl: "#" },
  { id: "shop-7", name: "Gold Hoop Earrings", brand: "Mejuri", price: 48.00, originalPrice: null, image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400", category: "Jewelry", rating: 4.5, reviews: 445, trending: true, affiliateUrl: "#" },
  { id: "shop-8", name: "Aviator Sunglasses", brand: "Ray-Ban", price: 163.00, originalPrice: null, image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400", category: "Accessories", rating: 4.7, reviews: 567, trending: false, affiliateUrl: "#" },
  { id: "shop-9", name: "Lace Evening Gown", brand: "Self-Portrait", price: 475.00, originalPrice: 595.00, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400", category: "Dresses", rating: 4.9, reviews: 67, trending: false, affiliateUrl: "#" },
  { id: "shop-10", name: "High-Rise Wide Leg Jeans", brand: "Agolde", price: 198.00, originalPrice: null, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", category: "Bottoms", rating: 4.6, reviews: 334, trending: true, affiliateUrl: "#" },
  { id: "shop-11", name: "Puffer Jacket", brand: "The North Face", price: 249.00, originalPrice: null, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", category: "Outerwear", rating: 4.8, reviews: 678, trending: true, affiliateUrl: "#" },
  { id: "shop-12", name: "Satin Blouse", brand: "Vince", price: 285.00, originalPrice: 345.00, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400", category: "Tops", rating: 4.7, reviews: 123, trending: false, affiliateUrl: "#" },
];

const shopCategories = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Bags", "Accessories", "Jewelry"];

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("trending");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filtered = shopItems
    .filter((i) => category === "All" || i.category === category)
    .filter((i) => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.brand.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-sora font-bold mb-1 flex items-center space-x-2">
            <ShoppingBag className="w-8 h-8 text-primary" />
            <span>Shop</span>
          </h1>
          <p className="text-gray-500">Discover curated fashion finds from the community</p>
        </div>

        {/* FTC Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-sm text-amber-800 flex items-center space-x-2">
          <ShoppingBag className="w-4 h-4 flex-shrink-0" />
          <span>Items on this page include affiliate links. We may earn a commission on purchases.</span>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search items, brands..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Categories */}
        <div className="flex space-x-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
          {shopCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                category === cat
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Heart className={cn("w-4 h-4", favorites.has(item.id) ? "fill-red-500 text-red-500" : "text-gray-600")} />
                  </button>
                  {item.trending && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-primary to-secondary border-0">
                      <TrendingUp className="w-3 h-3 mr-1" /> Trending
                    </Badge>
                  )}
                  {item.originalPrice && (
                    <Badge className="absolute bottom-3 left-3 bg-red-500 border-0 text-white">
                      {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{item.brand}</p>
                  <h3 className="font-medium text-sm mb-2 line-clamp-1">{item.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-bold text-primary">{formatCurrency(item.price)}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">{formatCurrency(item.originalPrice)}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="text-xs font-medium">{item.rating}</span>
                      <span className="text-xs text-gray-400">({item.reviews})</span>
                    </div>
                    <a
                      href={item.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary font-medium hover:underline flex items-center space-x-0.5"
                    >
                      <span>Shop</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
