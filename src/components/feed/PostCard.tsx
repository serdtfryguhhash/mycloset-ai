"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  ExternalLink,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post } from "@/types";
import { useStore } from "@/store";
import { cn, formatNumber, formatDate, getInitials } from "@/lib/utils";
import toast from "react-hot-toast";

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

export default function PostCard({ post, compact = false }: PostCardProps) {
  const { toggleLike, toggleSave } = useStore();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showAffiliateItems, setShowAffiliateItems] = useState(false);
  const [doubleClickLike, setDoubleClickLike] = useState(false);

  const handleDoubleClick = () => {
    if (!post.is_liked) {
      toggleLike(post.id);
    }
    setDoubleClickLike(true);
    setTimeout(() => setDoubleClickLike(false), 1000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://mycloset.ai/post/${post.id}`);
    toast.success("Link copied to clipboard!");
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      toast.success("Comment posted!");
      setCommentText("");
    }
  };

  if (compact) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group relative rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
      >
        <div className="relative aspect-[3/4] overflow-hidden cursor-pointer" onDoubleClick={handleDoubleClick}>
          <img
            src={post.image_url}
            alt={post.caption}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <AnimatePresence>
            {doubleClickLike && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Heart className="w-20 h-20 text-white fill-white drop-shadow-lg" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1 text-sm">
                  <Heart className="w-4 h-4" /> <span>{formatNumber(post.like_count)}</span>
                </span>
                <span className="flex items-center space-x-1 text-sm">
                  <MessageCircle className="w-4 h-4" /> <span>{formatNumber(post.comment_count)}</span>
                </span>
              </div>
            </div>
          </div>

          {post.has_affiliate_links && (
            <div className="absolute top-2 right-2">
              <Badge variant="default" className="bg-black/50 text-white text-[10px] backdrop-blur-sm">
                <ShoppingBag className="w-2.5 h-2.5 mr-1" /> Shop
              </Badge>
            </div>
          )}
        </div>

        <div className="p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.user.avatar_url} />
              <AvatarFallback className="text-[10px]">{getInitials(post.user.display_name)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium truncate">{post.user.username}</span>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2">{post.caption}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link href={`/profile/${post.user.username}`} className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
            <AvatarImage src={post.user.avatar_url} />
            <AvatarFallback>{getInitials(post.user.display_name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-sm">{post.user.display_name}</span>
              {post.user.subscription_tier === "influencer" && (
                <span className="text-primary text-xs">&#10003;</span>
              )}
            </div>
            <span className="text-xs text-gray-400">{formatDate(post.created_at)}</span>
          </div>
        </Link>
        <button className="p-2 rounded-full hover:bg-gray-50 transition-colors">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Image */}
      <div className="relative cursor-pointer" onDoubleClick={handleDoubleClick}>
        <img
          src={post.image_url}
          alt={post.caption}
          className="w-full aspect-[4/5] object-cover"
        />
        <AnimatePresence>
          {doubleClickLike && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FTC Disclosure */}
      {post.has_affiliate_links && (
        <div className="px-4 pt-3">
          <div className="flex items-center space-x-1.5 text-xs text-gray-400">
            <AlertCircle className="w-3 h-3" />
            <span>Includes affiliate links</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button onClick={() => toggleLike(post.id)} className="group">
            <Heart
              className={cn(
                "w-6 h-6 transition-all duration-200 group-hover:scale-110",
                post.is_liked ? "fill-red-500 text-red-500" : "text-gray-700"
              )}
            />
          </button>
          <button onClick={() => setShowComments(!showComments)} className="group">
            <MessageCircle className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform" />
          </button>
          <button onClick={handleShare} className="group">
            <Share2 className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <div className="flex items-center space-x-3">
          {post.has_affiliate_links && (
            <button
              onClick={() => setShowAffiliateItems(!showAffiliateItems)}
              className="group"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700 group-hover:text-primary group-hover:scale-110 transition-all" />
            </button>
          )}
          <button onClick={() => toggleSave(post.id)} className="group">
            <Bookmark
              className={cn(
                "w-6 h-6 transition-all duration-200 group-hover:scale-110",
                post.is_saved ? "fill-gray-900 text-gray-900" : "text-gray-700"
              )}
            />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-2">
        <div className="flex items-center space-x-4 text-sm">
          <span className="font-semibold">{formatNumber(post.like_count)} likes</span>
          <span className="text-gray-400">{formatNumber(post.comment_count)} comments</span>
          <span className="text-gray-400">{formatNumber(post.save_count)} saves</span>
        </div>
      </div>

      {/* Caption */}
      <div className="px-4 pb-3">
        <p className="text-sm">
          <Link href={`/profile/${post.user.username}`} className="font-semibold mr-1.5 hover:underline">
            {post.user.username}
          </Link>
          {post.caption}
        </p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-primary hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Affiliate Items */}
      <AnimatePresence>
        {showAffiliateItems && post.affiliate_items.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="p-4">
              <h4 className="text-sm font-semibold mb-3 flex items-center space-x-1">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span>Shop This Look</span>
              </h4>
              <div className="space-y-3">
                {post.affiliate_items.map((item) => (
                  <a
                    key={item.id}
                    href={item.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">${item.price.toFixed(2)}</p>
                      <ExternalLink className="w-3 h-3 text-gray-400 ml-auto group-hover:text-primary transition-colors" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="p-4">
              <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50" />
                    <AvatarFallback>EC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold mr-1">emmavogue</span>
                      Obsessed with this look! Where is the jacket from?
                    </p>
                    <span className="text-xs text-gray-400">2h ago</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50" />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold mr-1">miafashion</span>
                      This is giving main character energy
                    </p>
                    <span className="text-xs text-gray-400">4h ago</span>
                  </div>
                </div>
              </div>
              <form onSubmit={handleComment} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 text-sm bg-gray-50 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button size="sm" type="submit" disabled={!commentText.trim()}>
                  Post
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
