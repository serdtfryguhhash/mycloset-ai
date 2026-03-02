"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shirt,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#BE185D", "#7C3AED", "#F59E0B", "#22C55E", "#3B82F6", "#EC4899", "#8B5CF6", "#14B8A6", "#F97316", "#6366F1", "#EF4444", "#10B981"];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function WardrobeAnalytics() {
  const { closetItems } = useStore();

  const analytics = useMemo(() => {
    const totalValue = closetItems.reduce((sum, item) => sum + item.price, 0);
    const totalWears = closetItems.reduce((sum, item) => sum + item.wear_count, 0);

    // Cost per wear
    const itemCPW = closetItems
      .filter((item) => item.wear_count > 0)
      .map((item) => ({
        name: `${item.brand} ${item.subcategory}`,
        cpw: item.price / item.wear_count,
        wears: item.wear_count,
        price: item.price,
        id: item.id,
      }))
      .sort((a, b) => a.cpw - b.cpw);

    // Most worn items
    const mostWorn = [...closetItems]
      .sort((a, b) => b.wear_count - a.wear_count)
      .slice(0, 8)
      .map((item) => ({
        name: `${item.brand} ${item.subcategory}`.slice(0, 15),
        wears: item.wear_count,
        brand: item.brand,
      }));

    // Least worn items
    const leastWorn = [...closetItems]
      .sort((a, b) => a.wear_count - b.wear_count)
      .slice(0, 5);

    // Color distribution
    const colorMap: Record<string, number> = {};
    closetItems.forEach((item) => {
      item.color.forEach((c) => {
        colorMap[c] = (colorMap[c] || 0) + 1;
      });
    });
    const colorDistribution = Object.entries(colorMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

    // Category breakdown
    const categoryMap: Record<string, number> = {};
    closetItems.forEach((item) => {
      const cat = item.category.charAt(0).toUpperCase() + item.category.slice(1);
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const categoryBreakdown = Object.entries(categoryMap)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({ name, value }));

    // Season distribution
    const seasonMap: Record<string, number> = {};
    closetItems.forEach((item) => {
      item.season.forEach((s) => {
        seasonMap[s] = (seasonMap[s] || 0) + 1;
      });
    });

    return {
      totalValue,
      totalWears,
      avgCPW: totalWears > 0 ? totalValue / totalWears : 0,
      itemCount: closetItems.length,
      itemCPW,
      mostWorn,
      leastWorn,
      colorDistribution,
      categoryBreakdown,
      seasonMap,
    };
  }, [closetItems]);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Items", value: analytics.itemCount.toString(), icon: Shirt, color: "text-primary" },
          { label: "Closet Value", value: formatCurrency(analytics.totalValue), icon: DollarSign, color: "text-green-500" },
          { label: "Total Wears", value: analytics.totalWears.toString(), icon: TrendingUp, color: "text-blue-500" },
          { label: "Avg Cost/Wear", value: formatCurrency(analytics.avgCPW), icon: TrendingDown, color: "text-amber-500" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} custom={i} initial="hidden" animate="visible" variants={fadeIn}>
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl bg-gray-50 ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-lg font-sora font-bold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Most Worn Chart */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Most Worn Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.mostWorn}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }}
                  />
                  <Bar dataKey="wears" fill="#BE185D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Color Distribution */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <span className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
                <span>Color Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics.colorDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {analytics.colorDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #f0f0f0", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {analytics.colorDistribution.map((c, i) => (
                  <div key={c.name} className="flex items-center space-x-1 text-xs text-gray-600">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div custom={6} initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <Shirt className="w-5 h-5 text-primary" />
                <span>Category Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.categoryBreakdown.map((cat, i) => {
                  const maxVal = analytics.categoryBreakdown[0]?.value || 1;
                  const pct = Math.round((cat.value / maxVal) * 100);
                  return (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 font-medium">{cat.name}</span>
                        <span className="text-gray-400">{cat.value} items</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" as const }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Least Worn / Underutilized */}
        <motion.div custom={7} initial="hidden" animate="visible" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Underutilized Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.leastWorn.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <img
                      src={item.thumbnail_url}
                      alt={item.subcategory}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.brand} {item.subcategory}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.wear_count} wears | {formatCurrency(item.price)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                      {item.wear_count === 0 ? "Unworn" : `${item.wear_count}x`}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-primary/5 rounded-xl">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold text-primary">AI Tip:</span> Try styling your underutilized items with your most-worn pieces for fresh outfit combinations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Best Cost Per Wear */}
        <motion.div custom={8} initial="hidden" animate="visible" variants={fadeIn} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span>Best Cost-Per-Wear</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {analytics.itemCPW.slice(0, 6).map((item, i) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-green-50/50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.wears} wears</p>
                    </div>
                    <Badge variant="success" className="text-xs">
                      {formatCurrency(item.cpw)}/wear
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
