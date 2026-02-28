"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Link as LinkIcon,
  Trash2,
  Save,
  Camera,
  Globe,
  Mail,
  Lock,
  Instagram,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useStore();
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [email, setEmail] = useState(user?.email || "");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [likeNotifs, setLikeNotifs] = useState(true);
  const [commentNotifs, setCommentNotifs] = useState(true);
  const [followNotifs, setFollowNotifs] = useState(true);
  const [affiliateNotifs, setAffiliateNotifs] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved!");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-sora font-bold mb-1">Settings</h1>
          <p className="text-gray-500">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white border border-gray-100 rounded-2xl h-12 p-1 w-full sm:w-auto">
            <TabsTrigger value="profile" className="rounded-xl"><User className="w-4 h-4 mr-2" /> Profile</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl"><Bell className="w-4 h-4 mr-2" /> Notifications</TabsTrigger>
            <TabsTrigger value="billing" className="rounded-xl"><CreditCard className="w-4 h-4 mr-2" /> Billing</TabsTrigger>
            <TabsTrigger value="privacy" className="rounded-xl"><Shield className="w-4 h-4 mr-2" /> Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback>{user?.display_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium">{user?.display_name}</p>
                    <p className="text-sm text-gray-500">@{user?.username}</p>
                    <Badge variant="pink" className="mt-1 text-xs capitalize">{user?.subscription_tier}</Badge>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Name</label>
                    <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    maxLength={150}
                  />
                  <p className="text-xs text-gray-400 mt-1">{bio.length}/150</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input value={website} onChange={(e) => setWebsite(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: "Email Notifications", desc: "Receive email updates", state: emailNotifs, setter: setEmailNotifs },
                  { label: "Push Notifications", desc: "Browser push notifications", state: pushNotifs, setter: setPushNotifs },
                  { label: "Likes", desc: "When someone likes your post", state: likeNotifs, setter: setLikeNotifs },
                  { label: "Comments", desc: "When someone comments on your post", state: commentNotifs, setter: setCommentNotifs },
                  { label: "New Followers", desc: "When someone follows you", state: followNotifs, setter: setFollowNotifs },
                  { label: "Affiliate Clicks", desc: "When someone clicks your affiliate links", state: affiliateNotifs, setter: setAffiliateNotifs },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => item.setter(!item.state)}
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative",
                        item.state ? "bg-primary" : "bg-gray-300"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform",
                        item.state ? "translate-x-5.5 left-[1px]" : "left-0.5"
                      )} style={{ transform: item.state ? "translateX(21px)" : "translateX(0)" }} />
                    </button>
                  </div>
                ))}
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" /> Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Plan</p>
                      <p className="text-2xl font-sora font-bold capitalize">{user?.subscription_tier}</p>
                    </div>
                    <Badge variant="pink" className="text-sm py-1 px-3">
                      {user?.commission_rate}% Commission
                    </Badge>
                  </div>
                  <Link href="/pricing">
                    <Button variant="outline" size="sm">
                      Change Plan <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Payment Method</h4>
                  <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Visa ending in 4242</p>
                        <p className="text-xs text-gray-500">Expires 12/2027</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Update</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Stripe Connect</h4>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Connected to Stripe</p>
                        <p className="text-xs text-gray-500">Receive affiliate payouts</p>
                      </div>
                      <Badge variant="success">Connected</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-sm">Private Profile</p>
                    <p className="text-xs text-gray-500">Only approved followers can see your content</p>
                  </div>
                  <button
                    onClick={() => setPrivateProfile(!privateProfile)}
                    className={cn("w-11 h-6 rounded-full transition-colors relative", privateProfile ? "bg-primary" : "bg-gray-300")}
                  >
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform" style={{ transform: privateProfile ? "translateX(21px)" : "translateX(2px)" }} />
                  </button>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Change Password</h4>
                  <div className="space-y-3">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                    <Button onClick={() => toast.success("Password updated!")}>Update Password</Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-red-500 mb-3">Danger Zone</h4>
                  <div className="p-4 border border-red-200 rounded-xl bg-red-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-700">Delete Account</p>
                        <p className="text-xs text-red-500">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => toast.error("Account deletion requires confirmation via email")}>
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
