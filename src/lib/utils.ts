import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatDate(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function generateGradient(index: number): string {
  const gradients = [
    "from-pink-500 to-purple-600",
    "from-purple-500 to-indigo-600",
    "from-amber-400 to-pink-500",
    "from-rose-400 to-purple-500",
    "from-fuchsia-500 to-pink-600",
    "from-violet-500 to-purple-600",
  ];
  return gradients[index % gradients.length];
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export const CATEGORY_ICONS: Record<string, string> = {
  tops: "👕",
  bottoms: "👖",
  dresses: "👗",
  outerwear: "🧥",
  shoes: "👟",
  accessories: "🎒",
  bags: "👜",
  jewelry: "💍",
  activewear: "🏃",
  swimwear: "👙",
  loungewear: "🩳",
  formal: "🤵",
};

export const OCCASION_LABELS: Record<string, string> = {
  casual: "Casual",
  work: "Work",
  formal: "Formal",
  date_night: "Date Night",
  party: "Party",
  athletic: "Athletic",
  vacation: "Vacation",
  everyday: "Everyday",
};

export const SEASON_LABELS: Record<string, string> = {
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
  winter: "Winter",
  all: "All Seasons",
};
