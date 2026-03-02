"use client";

const XP_STORAGE_KEY = "mycloset_xp_data";

export interface XPAction {
  type: "log_outfit" | "create_look" | "complete_challenge" | "get_like" | "upload_item" | "daily_visit";
  label: string;
  points: number;
}

export const XP_ACTIONS: Record<string, XPAction> = {
  log_outfit: { type: "log_outfit", label: "Log Outfit", points: 15 },
  create_look: { type: "create_look", label: "Create Look", points: 25 },
  complete_challenge: { type: "complete_challenge", label: "Complete Challenge", points: 50 },
  get_like: { type: "get_like", label: "Get Like", points: 5 },
  upload_item: { type: "upload_item", label: "Upload Item", points: 10 },
  daily_visit: { type: "daily_visit", label: "Daily Visit", points: 10 },
};

export interface StyleLevel {
  name: string;
  minXP: number;
  maxXP: number;
  icon: string;
  color: string;
}

export const STYLE_LEVELS: StyleLevel[] = [
  { name: "Newbie", minXP: 0, maxXP: 199, icon: "🌱", color: "from-gray-400 to-gray-500" },
  { name: "Trendy", minXP: 200, maxXP: 599, icon: "✨", color: "from-blue-400 to-blue-600" },
  { name: "Stylish", minXP: 600, maxXP: 1499, icon: "💎", color: "from-purple-400 to-purple-600" },
  { name: "Fashion Icon", minXP: 1500, maxXP: 3999, icon: "👑", color: "from-amber-400 to-amber-600" },
  { name: "Style Legend", minXP: 4000, maxXP: Infinity, icon: "🏆", color: "from-primary to-secondary" },
];

export interface XPData {
  totalXP: number;
  history: { action: string; points: number; timestamp: string }[];
  lastDailyVisit: string;
  achievements: string[];
}

function getDefault(): XPData {
  return {
    totalXP: 0,
    history: [],
    lastDailyVisit: "",
    achievements: [],
  };
}

function loadXPData(): XPData {
  if (typeof window === "undefined") return getDefault();
  const stored = localStorage.getItem(XP_STORAGE_KEY);
  if (!stored) return getDefault();
  try {
    return JSON.parse(stored);
  } catch {
    return getDefault();
  }
}

function saveXPData(data: XPData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(XP_STORAGE_KEY, JSON.stringify(data));
}

export function getXPData(): XPData {
  return loadXPData();
}

export function getCurrentLevel(xp: number): StyleLevel {
  for (let i = STYLE_LEVELS.length - 1; i >= 0; i--) {
    if (xp >= STYLE_LEVELS[i].minXP) return STYLE_LEVELS[i];
  }
  return STYLE_LEVELS[0];
}

export function getNextLevel(xp: number): StyleLevel | null {
  const current = getCurrentLevel(xp);
  const idx = STYLE_LEVELS.indexOf(current);
  if (idx < STYLE_LEVELS.length - 1) return STYLE_LEVELS[idx + 1];
  return null;
}

export function getLevelProgress(xp: number): number {
  const current = getCurrentLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  const range = next.minXP - current.minXP;
  const progress = xp - current.minXP;
  return Math.min(100, Math.round((progress / range) * 100));
}

export function addXP(actionType: string): { data: XPData; gained: number; leveledUp: boolean; newLevel: StyleLevel | null } {
  const action = XP_ACTIONS[actionType];
  if (!action) return { data: loadXPData(), gained: 0, leveledUp: false, newLevel: null };

  const data = loadXPData();

  // Check daily visit dedup
  if (actionType === "daily_visit") {
    const today = new Date().toISOString().split("T")[0];
    if (data.lastDailyVisit === today) {
      return { data, gained: 0, leveledUp: false, newLevel: null };
    }
    data.lastDailyVisit = today;
  }

  const oldLevel = getCurrentLevel(data.totalXP);
  data.totalXP += action.points;
  const newLevel = getCurrentLevel(data.totalXP);
  const leveledUp = newLevel.name !== oldLevel.name;

  data.history.push({
    action: action.label,
    points: action.points,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 100 entries
  if (data.history.length > 100) {
    data.history = data.history.slice(-100);
  }

  saveXPData(data);
  return { data, gained: action.points, leveledUp, newLevel: leveledUp ? newLevel : null };
}

export function initializeXP(baseXP: number) {
  const data = loadXPData();
  if (data.totalXP === 0 && baseXP > 0) {
    data.totalXP = baseXP;
    saveXPData(data);
  }
  return data;
}
