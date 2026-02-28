export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  website: string;
  instagram_handle: string;
  style_dna: string[];
  badges: Badge[];
  subscription_tier: "free" | "stylist" | "influencer";
  stripe_customer_id: string | null;
  stripe_connect_id: string | null;
  commission_rate: number;
  total_earnings: number;
  follower_count: number;
  following_count: number;
  post_count: number;
  closet_item_count: number;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned_at: string;
}

export interface ClothingItem {
  id: string;
  user_id: string;
  image_url: string;
  thumbnail_url: string;
  category: ClothingCategory;
  subcategory: string;
  brand: string;
  color: string[];
  pattern: string;
  material: string;
  season: Season[];
  occasion: Occasion[];
  style_tags: string[];
  purchase_url: string;
  affiliate_url: string;
  price: number;
  ai_description: string;
  is_favorite: boolean;
  wear_count: number;
  last_worn: string | null;
  created_at: string;
}

export type ClothingCategory =
  | "tops"
  | "bottoms"
  | "dresses"
  | "outerwear"
  | "shoes"
  | "accessories"
  | "bags"
  | "jewelry"
  | "activewear"
  | "swimwear"
  | "loungewear"
  | "formal";

export type Season = "spring" | "summer" | "fall" | "winter" | "all";
export type Occasion =
  | "casual"
  | "work"
  | "formal"
  | "date_night"
  | "party"
  | "athletic"
  | "vacation"
  | "everyday";

export interface Outfit {
  id: string;
  user_id: string;
  name: string;
  description: string;
  items: ClothingItem[];
  item_ids: string[];
  occasion: Occasion;
  season: Season;
  weather: string;
  ai_generated: boolean;
  ai_visualization_url: string | null;
  flat_lay_url: string | null;
  style_score: number;
  is_favorite: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  user: User;
  outfit_id: string | null;
  outfit: Outfit | null;
  image_url: string;
  caption: string;
  tags: string[];
  has_affiliate_links: boolean;
  affiliate_items: AffiliateItem[];
  like_count: number;
  comment_count: number;
  save_count: number;
  share_count: number;
  is_liked: boolean;
  is_saved: boolean;
  challenge_id: string | null;
  created_at: string;
}

export interface AffiliateItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  affiliate_url: string;
  commission_rate: number;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  user: User;
  content: string;
  like_count: number;
  is_liked: boolean;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface AffiliateClick {
  id: string;
  user_id: string;
  item_id: string;
  post_id: string;
  clicked_by: string;
  ip_address: string;
  converted: boolean;
  commission_amount: number;
  created_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  theme: string;
  cover_image: string;
  start_date: string;
  end_date: string;
  prize_description: string;
  entry_count: number;
  vote_count: number;
  status: "upcoming" | "active" | "voting" | "completed";
  winner_id: string | null;
  winner: User | null;
  created_at: string;
}

export interface ChallengeEntry {
  id: string;
  challenge_id: string;
  user_id: string;
  user: User;
  post_id: string;
  post: Post;
  vote_count: number;
  rank: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: "free" | "stylist" | "influencer";
  stripe_subscription_id: string;
  status: "active" | "canceled" | "past_due";
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

export interface Payout {
  id: string;
  user_id: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  stripe_transfer_id: string;
  period_start: string;
  period_end: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type:
    | "like"
    | "comment"
    | "follow"
    | "mention"
    | "challenge"
    | "payout"
    | "badge"
    | "affiliate_click";
  title: string;
  message: string;
  image_url: string;
  link: string;
  is_read: boolean;
  actor_id: string;
  actor: User | null;
  created_at: string;
}

export interface EarningsData {
  total_earnings: number;
  pending_earnings: number;
  this_month: number;
  last_month: number;
  total_clicks: number;
  total_conversions: number;
  conversion_rate: number;
  daily_earnings: { date: string; amount: number; clicks: number }[];
  top_items: {
    item: AffiliateItem;
    clicks: number;
    conversions: number;
    revenue: number;
  }[];
  payouts: Payout[];
}

export interface StyleDNA {
  primary_style: string;
  color_palette: string[];
  favorite_brands: string[];
  occasion_breakdown: { occasion: string; percentage: number }[];
  category_breakdown: { category: string; count: number }[];
}

export interface PricingTier {
  name: string;
  tier: "free" | "stylist" | "influencer";
  price: number;
  description: string;
  features: string[];
  commission_rate: number;
  highlighted: boolean;
  stripe_price_id: string;
}
