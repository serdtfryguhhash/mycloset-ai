"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Share2,
  Grid,
  Bookmark,
  Heart,
  MapPin,
  Link as LinkIcon,
  Instagram,
  Shirt,
  Trophy,
  Sparkles,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store";
import { mockStyleDNA, mockPosts } from "@/lib/mock-data";
import { cn, formatNumber } from "@/lib/utils";
import Link from "next/link";
import PostCard from "@/components/feed/PostCard";
import toast from "react-hot-toast";

export default function ProfilePage({ params }: { params: { username: string } }) {
  const { user, posts } = useStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const isOwnProfile = user?.username === params.username;
  const profileUser = user; // In production, fetch by username

  if (!profileUser) return null;

  const styleDNA = mockStyleDNA;
  const userPosts = posts.filter((p) => p.user_id === profileUser.id);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-6">
          {/* Cover */}
          <div className="h-32 sm:h-44 bg-gradient-to-r from-primary via-secondary to-accent relative">
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-12 sm:-mt-16 mb-4">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-white">
                <AvatarImage src={profileUser.avatar_url} />
                <AvatarFallback className="text-2xl">{profileUser.display_name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 sm:ml-6 mt-4 sm:mt-0 sm:mb-2">
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-2xl font-sora font-bold">{profileUser.display_name}</h1>
                  {profileUser.subscription_tier === "influencer" && (
                    <Badge variant="pink" className="text-xs">Verified</Badge>
                  )}
                </div>
                <p className="text-gray-500 text-sm">@{profileUser.username}</p>
              </div>

              <div className="flex space-x-2 mt-4 sm:mt-0">
                {isOwnProfile ? (
                  <>
                    <Link href="/settings">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-1" /> Edit Profile
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => toast.success("Profile link copied!")}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => setIsFollowing(!isFollowing)}
                      variant={isFollowing ? "outline" : "default"}
                      size="sm"
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button variant="outline" size="sm">Message</Button>
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-700 mb-3">{profileUser.bio}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              {profileUser.website && (
                <a href={profileUser.website} className="flex items-center space-x-1 text-primary hover:underline">
                  <LinkIcon className="w-3 h-3" />
                  <span>{profileUser.website.replace("https://", "")}</span>
                </a>
              )}
              {profileUser.instagram_handle && (
                <span className="flex items-center space-x-1">
                  <Instagram className="w-3 h-3" />
                  <span>{profileUser.instagram_handle}</span>
                </span>
              )}
            </div>

            {/* Badges */}
            {profileUser.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {profileUser.badges.map((badge) => (
                  <Badge key={badge.id} variant="outline" className="text-xs py-1">
                    <span className="mr-1">{badge.icon}</span> {badge.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="font-sora font-bold text-xl">{formatNumber(profileUser.post_count)}</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="text-center cursor-pointer">
                <p className="font-sora font-bold text-xl">{formatNumber(profileUser.follower_count)}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center cursor-pointer">
                <p className="font-sora font-bold text-xl">{formatNumber(profileUser.following_count)}</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
              <div className="text-center">
                <p className="font-sora font-bold text-xl">{profileUser.closet_item_count}</p>
                <p className="text-xs text-gray-500">Closet Items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Style DNA */}
        <Card className="p-6 mb-6">
          <h3 className="font-sora font-semibold text-lg mb-4 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>Style DNA</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Primary Style</p>
              <p className="font-sora font-bold text-xl gradient-text mb-4">{styleDNA.primary_style}</p>
              <p className="text-sm text-gray-500 mb-2">Color Palette</p>
              <div className="flex space-x-2 mb-4">
                {styleDNA.color_palette.map((color, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }} />
                ))}
              </div>
              <p className="text-sm text-gray-500 mb-2">Favorite Brands</p>
              <div className="flex flex-wrap gap-1.5">
                {styleDNA.favorite_brands.map((brand) => (
                  <Badge key={brand} variant="outline" className="text-xs">{brand}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-3">Occasion Breakdown</p>
              <div className="space-y-3">
                {styleDNA.occasion_breakdown.map((item) => (
                  <div key={item.occasion}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{item.occasion}</span>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="posts">
          <TabsList className="w-full bg-white border border-gray-100 rounded-2xl h-12 p-1">
            <TabsTrigger value="posts" className="flex-1 rounded-xl">
              <Grid className="w-4 h-4 mr-2" /> Posts
            </TabsTrigger>
            <TabsTrigger value="outfits" className="flex-1 rounded-xl">
              <Shirt className="w-4 h-4 mr-2" /> Outfits
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex-1 rounded-xl">
              <Bookmark className="w-4 h-4 mr-2" /> Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {mockPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aspect-square rounded-xl overflow-hidden group relative cursor-pointer"
                >
                  <img src={post.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center space-x-4 text-white">
                      <span className="flex items-center space-x-1">
                        <Heart className="w-5 h-5 fill-white" />
                        <span className="font-semibold text-sm">{formatNumber(post.like_count)}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="outfits" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-gray-200 flex items-center justify-center">
                  <Shirt className="w-10 h-10 text-gray-300" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {mockPosts.filter((p) => p.is_saved).map((post) => (
                <div key={post.id} className="aspect-square rounded-xl overflow-hidden">
                  <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              {mockPosts.filter((p) => p.is_saved).length === 0 && (
                <div className="col-span-3 text-center py-16">
                  <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No saved posts yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
