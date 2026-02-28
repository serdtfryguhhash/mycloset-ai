"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shirt, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useStore();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const passwordStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
  const strength = passwordStrength();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the terms");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    login(email, password);
    toast.success("Welcome to MyCloset.ai!");
    router.push("/closet");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <span className="font-sora font-bold text-2xl gradient-text">MyCloset.ai</span>
          </div>

          <h1 className="text-3xl font-sora font-bold mb-2">Create your account</h1>
          <p className="text-gray-500 mb-8">Start your fashion journey today</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input type="text" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                  <Input type="text" placeholder="janestyle" value={username} onChange={(e) => setUsername(e.target.value)} className="pl-8" required />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex space-x-1 mb-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i < strength ? strengthColors[strength - 1] : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <p className={`text-xs ${strength >= 3 ? "text-green-600" : strength >= 2 ? "text-blue-600" : "text-gray-500"}`}>
                    {strengthLabels[strength - 1] || "Too short"}
                  </p>
                </div>
              )}
            </div>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and{" "}
                <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-4 text-sm text-gray-400">or sign up with</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["Google", "Apple", "Instagram"].map((provider) => (
              <button
                key={provider}
                onClick={() => toast.success(`${provider} signup coming soon!`)}
                className="flex items-center justify-center h-12 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {provider}
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>

          <div className="mt-6 p-4 bg-primary/5 rounded-xl">
            <div className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-800">Free forever plan included</p>
                <p className="text-xs text-gray-500 mt-0.5">Upload 50 items, 3 AI outfits/mo, full social access</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200"
          alt="Fashion"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <h2 className="text-4xl font-sora font-bold text-white mb-4">
            Join the Fashion Revolution
          </h2>
          <p className="text-white/80 text-lg">
            150,000+ fashion lovers are already using MyCloset.ai to elevate their style.
          </p>
        </div>
      </div>
    </div>
  );
}
