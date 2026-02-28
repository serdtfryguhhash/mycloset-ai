"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shirt,
  Sparkles,
  Camera,
  Users,
  ShoppingBag,
  TrendingUp,
  Trophy,
  Star,
  ArrowRight,
  Check,
  Zap,
  Heart,
  Eye,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/Footer";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: Camera,
    title: "AI Closet Manager",
    description: "Upload photos and let GPT-4 Vision auto-detect category, colors, brand, and style tags instantly.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: Sparkles,
    title: "AI Outfit Generator",
    description: "Select occasion and weather, and AI generates perfect outfit combinations from your closet.",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: Eye,
    title: "AI Visualization",
    description: "See your outfits come to life with DALL-E powered flat-lay and model visualizations.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Users,
    title: "Social Feed",
    description: "Share your outfits in a Pinterest-style masonry feed. Like, save, comment, and follow.",
    gradient: "from-pink-500 to-purple-600",
  },
  {
    icon: DollarSign,
    title: "Earn with Affiliate",
    description: "Link products to your posts. Earn commissions on every click and conversion.",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: Trophy,
    title: "Style Challenges",
    description: "Join weekly themed challenges, get community votes, and win prizes.",
    gradient: "from-yellow-500 to-amber-600",
  },
];

const stats = [
  { label: "Active Users", value: "150K+", icon: Users },
  { label: "Outfits Created", value: "2.5M+", icon: Sparkles },
  { label: "Items Uploaded", value: "8M+", icon: Shirt },
  { label: "Earned by Creators", value: "$1.2M+", icon: DollarSign },
];

const testimonials = [
  {
    name: "Jessica Park",
    role: "Fashion Influencer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    text: "MyCloset.ai completely transformed how I manage my wardrobe. The AI suggestions are scarily accurate!",
    rating: 5,
  },
  {
    name: "Rachel Kim",
    role: "Stylist",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    text: "I've earned over $3,000 in affiliate commissions in just 3 months. The platform is a game-changer.",
    rating: 5,
  },
  {
    name: "Emma Davis",
    role: "Fashion Blogger",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    text: "The outfit generator saves me so much time getting ready. It knows my style better than I do!",
    rating: 5,
  },
];

export default function LandingPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="pink" className="mb-6 px-4 py-1.5 text-sm">
                <Zap className="w-3 h-3 mr-1" /> Powered by GPT-4 Vision & DALL-E 3
              </Badge>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-sora font-bold leading-tight">
                Your Closet,{" "}
                <span className="gradient-text">Reimagined</span>{" "}
                with AI
              </h1>

              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                Upload your wardrobe, get AI-powered outfit suggestions, share your style
                with the community, and earn money through fashion affiliate commerce.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-5 pr-4 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <Link href="/signup">
                  <Button size="xl" className="w-full sm:w-auto group">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Free forever. No credit card required. Join 150,000+ fashion lovers.
              </p>

              <div className="mt-8 flex items-center space-x-6">
                <div className="flex -space-x-3">
                  {["photo-1494790108377-be9c29b29330", "photo-1438761681033-6461ffad8d80", "photo-1534528741775-53994a69daeb", "photo-1517841905240-472988babdf9"].map((id, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img src={`https://images.unsplash.com/${id}?w=80`} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Loved by 150K+ users</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                    <div className="flex-1 bg-white/20 rounded-lg h-6 mx-8" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary" />
                      <div>
                        <div className="h-3 w-24 bg-gray-200 rounded-full" />
                        <div className="h-2 w-16 bg-gray-100 rounded-full mt-1.5" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        "photo-1596755094514-f87e34085b2c",
                        "photo-1594938298603-c8148c4dae35",
                        "photo-1585487000160-6ebcfceb0d44",
                        "photo-1551028719-00167b16eac5",
                        "photo-1543163521-1bf539c55dd2",
                        "photo-1584917865442-de89df76afd3",
                      ].map((id, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden">
                          <img
                            src={`https://images.unsplash.com/${id}?w=200`}
                            alt=""
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-gray-700">AI suggests: Casual Friday Chic</span>
                      </div>
                      <Badge variant="pink">92% match</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">AI Tagged!</p>
                    <p className="text-[10px] text-gray-500">Silk Blouse, Zara</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Commission Earned</p>
                    <p className="text-[10px] text-green-500 font-medium">+$12.50</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="text-center text-white"
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                  <p className="text-3xl sm:text-4xl font-sora font-bold">{stat.value}</p>
                  <p className="text-sm opacity-80 mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="pink" className="mb-4">Features</Badge>
            <h2 className="text-4xl sm:text-5xl font-sora font-bold">
              Everything You Need to{" "}
              <span className="gradient-text">Slay</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              From AI-powered wardrobe management to social commerce, we have got every
              fashion need covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  <Card className="p-8 h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-sora font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="purple" className="mb-4">How It Works</Badge>
            <h2 className="text-4xl sm:text-5xl font-sora font-bold">
              Three Steps to{" "}
              <span className="gradient-text">Fashion Freedom</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Upload Your Closet",
                description: "Take photos or upload images of your clothing. AI instantly categorizes and tags each item.",
                icon: Camera,
              },
              {
                step: "02",
                title: "Generate Outfits",
                description: "Tell AI your occasion and weather. Get personalized outfit combinations from your own wardrobe.",
                icon: Sparkles,
              },
              {
                step: "03",
                title: "Share & Earn",
                description: "Post your looks, build a following, and earn commissions through affiliate product links.",
                icon: TrendingUp,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className="text-center"
                >
                  <div className="relative inline-block mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-sora font-semibold mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="pink" className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl sm:text-5xl font-sora font-bold">
              Loved by <span className="gradient-text">Fashion Lovers</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <Card className="p-8 h-full">
                  <div className="flex items-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center space-x-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-sora font-bold text-white mb-6">
              Ready to Transform Your Wardrobe?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join 150,000+ fashion enthusiasts who are already using AI to elevate
              their style game.
            </p>
            <Link href="/signup">
              <Button
                size="xl"
                className="bg-white text-primary hover:bg-white/90 shadow-2xl group"
              >
                Start For Free
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-white/60 text-sm mt-4">No credit card required</p>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-sora font-bold mb-3">Stay in Style</h3>
          <p className="text-gray-500 mb-6">
            Get weekly fashion tips, trend alerts, and exclusive AI features delivered to your inbox.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 h-12 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <Button size="lg">Subscribe</Button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
