"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Plus,
  Menu,
  X,
  Home,
  Compass,
  ShoppingBag,
  Trophy,
  User,
  Shirt,
  Sparkles,
  DollarSign,
  Settings,
  LogOut,
  Heart,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import { StreakBadge } from "@/components/shared/StreakBadge";

export default function Navbar() {
  const pathname = usePathname();
  const { user, unreadNotifications, logout } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isLanding = pathname === "/";
  const isAuth = pathname === "/login" || pathname === "/signup";

  if (isAuth) return null;

  const navLinks = [
    { href: "/feed", label: "Feed", icon: Home },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/closet", label: "Closet", icon: Shirt },
    { href: "/outfits", label: "Outfits", icon: Sparkles },
    { href: "/shop", label: "Shop", icon: ShoppingBag },
    { href: "/challenges", label: "Challenges", icon: Trophy },
  ];

  if (isLanding) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <span className="font-sora font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MyCloset.ai
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm text-gray-600 hover:text-primary transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-primary transition-colors">How it Works</Link>
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-primary transition-colors">Pricing</Link>
            </div>
            <div className="flex items-center space-x-3">
              <StreakBadge />
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/feed" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-white" />
                </div>
                <span className="font-sora font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
                  MyCloset.ai
                </span>
              </Link>

              <div className="hidden lg:flex items-center space-x-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                  return (
                    <Link key={link.href} href={link.href}>
                      <button
                        className={cn(
                          "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </button>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <StreakBadge />
              <div className="hidden sm:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search styles..."
                  className="w-48 lg:w-64 h-9 pl-9 pr-4 rounded-xl bg-gray-50 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <Link href="/outfits/generate">
                <Button size="icon" className="rounded-xl h-9 w-9">
                  <Plus className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/notifications" className="relative">
                <button className="p-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage src={user?.avatar_url} alt={user?.display_name} />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-sm">{user?.display_name}</p>
                        <p className="text-xs text-gray-500">@{user?.username}</p>
                        <Badge variant="pink" className="mt-1 text-[10px]">
                          {user?.subscription_tier === "influencer" ? "Influencer" : user?.subscription_tier === "stylist" ? "Stylist" : "Free"}
                        </Badge>
                      </div>
                      <div className="py-1">
                        <Link href={`/profile/${user?.username}`} onClick={() => setProfileDropdownOpen(false)}>
                          <button className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                            <User className="w-4 h-4" /> <span>My Profile</span>
                          </button>
                        </Link>
                        <Link href="/closet" onClick={() => setProfileDropdownOpen(false)}>
                          <button className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                            <Shirt className="w-4 h-4" /> <span>My Closet</span>
                          </button>
                        </Link>
                        <Link href="/earnings" onClick={() => setProfileDropdownOpen(false)}>
                          <button className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                            <DollarSign className="w-4 h-4" /> <span>Earnings</span>
                          </button>
                        </Link>
                        <Link href="/settings" onClick={() => setProfileDropdownOpen(false)}>
                          <button className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                            <Settings className="w-4 h-4" /> <span>Settings</span>
                          </button>
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={() => { logout(); setProfileDropdownOpen(false); }}
                          className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" /> <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-50"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 bg-white border-b border-gray-100 shadow-xl lg:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                    <button
                      className={cn(
                        "flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </button>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-gray-100">
                <Link href="/earnings" onClick={() => setMobileMenuOpen(false)}>
                  <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                    <DollarSign className="w-5 h-5" /> <span>Earnings</span>
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Mobile Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-100 lg:hidden">
        <div className="flex items-center justify-around py-2 px-2">
          {[
            { href: "/feed", icon: Home, label: "Feed" },
            { href: "/explore", icon: Compass, label: "Explore" },
            { href: "/closet", icon: Shirt, label: "Closet" },
            { href: "/outfits", icon: Sparkles, label: "Outfits" },
            { href: `/profile/${user?.username}`, icon: User, label: "Profile" },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <button className="flex flex-col items-center space-y-0.5 p-1">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-primary" : "text-gray-400"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      isActive ? "text-primary" : "text-gray-400"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
