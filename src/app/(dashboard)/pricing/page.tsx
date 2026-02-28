"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PRICING_TIERS } from "@/lib/stripe";
import { cn, formatCurrency } from "@/lib/utils";
import { useStore } from "@/store";
import toast from "react-hot-toast";

export default function PricingPage() {
  const { user } = useStore();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const tierIcons = {
    free: Zap,
    stylist: Sparkles,
    influencer: Crown,
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-24 lg:pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="pink" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl sm:text-5xl font-sora font-bold mb-4">
            Choose Your <span className="gradient-text">Style Plan</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Start free and upgrade as you grow. Earn commissions and unlock premium AI features.
          </p>

          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                billing === "monthly" ? "bg-primary text-white" : "text-gray-500"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                billing === "yearly" ? "bg-primary text-white" : "text-gray-500"
              )}
            >
              Yearly
              <Badge variant="success" className="ml-2 text-[10px]">Save 20%</Badge>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {PRICING_TIERS.map((tier, i) => {
            const Icon = tierIcons[tier.tier];
            const isCurrentPlan = user?.subscription_tier === tier.tier;
            const yearlyPrice = tier.price * 0.8;
            const displayPrice = billing === "yearly" ? yearlyPrice : tier.price;

            return (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <Card
                  className={cn(
                    "relative p-8 h-full flex flex-col",
                    tier.highlighted && "ring-2 ring-primary shadow-xl scale-105 z-10"
                  )}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-secondary border-0 text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                      tier.highlighted
                        ? "bg-gradient-to-r from-primary to-secondary"
                        : "bg-gray-100"
                    )}>
                      <Icon className={cn("w-6 h-6", tier.highlighted ? "text-white" : "text-gray-600")} />
                    </div>

                    <h3 className="font-sora text-xl font-bold mb-1">{tier.name}</h3>
                    <p className="text-sm text-gray-500">{tier.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-4xl font-sora font-bold">
                        {displayPrice === 0 ? "Free" : `$${displayPrice.toFixed(2)}`}
                      </span>
                      {displayPrice > 0 && (
                        <span className="text-gray-400 text-sm">/month</span>
                      )}
                    </div>
                    {tier.commission_rate > 0 && (
                      <p className="text-sm text-primary font-medium mt-1">
                        {tier.commission_rate}% affiliate commission
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 flex-1 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start space-x-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={tier.highlighted ? "default" : "outline"}
                    size="lg"
                    disabled={isCurrentPlan}
                    onClick={() => {
                      if (isCurrentPlan) return;
                      toast.success(`Upgrading to ${tier.name} plan!`);
                    }}
                  >
                    {isCurrentPlan ? (
                      "Current Plan"
                    ) : tier.price === 0 ? (
                      "Get Started"
                    ) : (
                      <>
                        Upgrade to {tier.name}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-sora font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Can I cancel anytime?", a: "Yes! You can cancel your subscription at any time. You will retain access to your plan features until the end of your billing period." },
              { q: "How do affiliate commissions work?", a: "When you share products with affiliate links and someone makes a purchase, you earn a commission based on your plan tier. Free users do not earn commissions, Stylist earns 5%, and Influencer earns 12%." },
              { q: "When do I get paid?", a: "Payouts are processed monthly via Stripe Connect. You need a minimum balance of $25 to request a payout. Funds are typically available within 2-3 business days." },
              { q: "What happens to my data if I downgrade?", a: "Your closet items and outfits are preserved. However, you may lose access to premium features like unlimited AI generations and advanced analytics." },
            ].map((faq) => (
              <Card key={faq.q} className="p-6">
                <h4 className="font-semibold mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
