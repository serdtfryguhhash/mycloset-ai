"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  MousePointerClick,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  CreditCard,
  ExternalLink,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store";
import { formatCurrency, formatNumber } from "@/lib/utils";
import toast from "react-hot-toast";

export default function EarningsPage() {
  const { earnings, user } = useStore();
  const [period, setPeriod] = useState("7d");

  const percentChange = earnings.last_month > 0
    ? ((earnings.this_month - earnings.last_month) / earnings.last_month * 100).toFixed(1)
    : "0";

  const isPositive = Number(percentChange) >= 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-sora font-bold mb-1">Earnings Dashboard</h1>
            <p className="text-gray-500">Track your affiliate earnings and payouts</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Badge variant="pink" className="text-sm py-1 px-3">
              {user?.commission_rate}% Commission Rate
            </Badge>
            <Button variant="outline" size="sm" onClick={() => toast.success("Report downloaded!")}>
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: "Total Earnings",
              value: formatCurrency(earnings.total_earnings),
              icon: DollarSign,
              color: "text-green-600",
              bg: "bg-green-50",
              change: null,
            },
            {
              title: "This Month",
              value: formatCurrency(earnings.this_month),
              icon: TrendingUp,
              color: "text-primary",
              bg: "bg-primary/5",
              change: { value: percentChange, positive: isPositive },
            },
            {
              title: "Total Clicks",
              value: formatNumber(earnings.total_clicks),
              icon: MousePointerClick,
              color: "text-secondary",
              bg: "bg-secondary/5",
              change: null,
            },
            {
              title: "Conversion Rate",
              value: `${earnings.conversion_rate}%`,
              icon: ShoppingCart,
              color: "text-accent",
              bg: "bg-accent/5",
              change: null,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    {stat.change && (
                      <Badge
                        variant={stat.change.positive ? "success" : "destructive"}
                        className="text-xs"
                      >
                        {stat.change.positive ? (
                          <ArrowUpRight className="w-3 h-3 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        )}
                        {stat.change.value}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-2xl font-sora font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.title}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">Revenue Overview</CardTitle>
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-0.5">
                  {["7d", "30d", "90d", "1y"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        period === p ? "bg-white shadow-sm text-primary" : "text-gray-500"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={earnings.daily_earnings}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#BE185D" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#BE185D" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "#9CA3AF" }}
                        tickFormatter={(val) => new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      />
                      <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} tickFormatter={(val) => `$${val}`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1C1917",
                          border: "none",
                          borderRadius: "12px",
                          color: "#fff",
                          fontSize: "13px",
                        }}
                        formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
                        labelFormatter={(label) => new Date(label).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#BE185D"
                        strokeWidth={2}
                        fill="url(#colorAmount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Clicks Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={earnings.daily_earnings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "#9CA3AF" }}
                        tickFormatter={(val) => new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      />
                      <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1C1917",
                          border: "none",
                          borderRadius: "12px",
                          color: "#fff",
                          fontSize: "13px",
                        }}
                      />
                      <Bar dataKey="clicks" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Payout */}
            <Card className="bg-gradient-to-br from-primary to-secondary text-white">
              <CardContent className="p-6">
                <p className="text-white/70 text-sm mb-1">Pending Payout</p>
                <p className="text-3xl font-sora font-bold mb-4">
                  {formatCurrency(earnings.pending_earnings)}
                </p>
                <Button className="w-full bg-white text-primary hover:bg-white/90" onClick={() => toast.success("Payout requested!")}>
                  <CreditCard className="w-4 h-4 mr-2" /> Request Payout
                </Button>
                <p className="text-white/60 text-xs mt-3 text-center">
                  Minimum payout: $25.00 via Stripe Connect
                </p>
              </CardContent>
            </Card>

            {/* Top Performing Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earnings.top_items.map((entry, i) => (
                    <div key={entry.item.id} className="flex items-center space-x-3">
                      <span className="text-sm font-bold text-gray-400 w-5">#{i + 1}</span>
                      <img
                        src={entry.item.image_url}
                        alt={entry.item.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{entry.item.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatNumber(entry.clicks)} clicks | {entry.conversions} sales
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(entry.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Payouts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {earnings.payouts.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium">{formatCurrency(payout.amount)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(payout.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </p>
                      </div>
                      <Badge variant={payout.status === "completed" ? "success" : "outline"} className="capitalize text-xs">
                        {payout.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
