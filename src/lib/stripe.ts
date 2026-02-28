import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-02-25.clover" as const,
});

export const PRICING_TIERS = [
  {
    name: "Free",
    tier: "free" as const,
    price: 0,
    description: "Perfect for getting started with your digital closet",
    features: [
      "Upload up to 50 items",
      "3 AI outfit generations/month",
      "Basic style tags",
      "View social feed",
      "Join style challenges",
    ],
    commission_rate: 0,
    highlighted: false,
    stripe_price_id: "",
  },
  {
    name: "Stylist",
    tier: "stylist" as const,
    price: 9.99,
    description: "For fashion enthusiasts who want more",
    features: [
      "Unlimited closet items",
      "25 AI outfit generations/month",
      "AI outfit visualization (DALL-E)",
      "Advanced style analytics",
      "Affiliate link earnings (5%)",
      "Priority support",
      "Style DNA analysis",
      "Weather-based outfits",
    ],
    commission_rate: 5,
    highlighted: true,
    stripe_price_id: process.env.STRIPE_STYLIST_PRICE_ID || "price_stylist",
  },
  {
    name: "Influencer",
    tier: "influencer" as const,
    price: 24.99,
    description: "For creators and fashion influencers",
    features: [
      "Everything in Stylist",
      "Unlimited AI generations",
      "Premium DALL-E visualizations",
      "Affiliate earnings (12%)",
      "Stripe Connect payouts",
      "Featured in explore",
      "Custom branded profile",
      "Analytics dashboard",
      "Early access to features",
      "Verified badge",
    ],
    commission_rate: 12,
    highlighted: false,
    stripe_price_id: process.env.STRIPE_INFLUENCER_PRICE_ID || "price_influencer",
  },
];
