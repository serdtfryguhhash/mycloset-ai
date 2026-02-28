import { create } from "zustand";
import {
  User,
  ClothingItem,
  Outfit,
  Post,
  Challenge,
  Notification,
  EarningsData,
} from "@/types";
import {
  currentUser,
  mockClothingItems,
  mockOutfits,
  mockPosts,
  mockChallenges,
  mockNotifications,
  mockEarnings,
} from "@/lib/mock-data";

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  closetItems: ClothingItem[];
  outfits: Outfit[];
  posts: Post[];
  challenges: Challenge[];
  notifications: Notification[];
  earnings: EarningsData;
  unreadNotifications: number;
  selectedCategory: string;
  feedTab: "following" | "explore";

  login: (email: string, password: string) => void;
  logout: () => void;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  toggleItemFavorite: (itemId: string) => void;
  addClothingItem: (item: ClothingItem) => void;
  removeClothingItem: (itemId: string) => void;
  addOutfit: (outfit: Outfit) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  setSelectedCategory: (category: string) => void;
  setFeedTab: (tab: "following" | "explore") => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  user: currentUser,
  isAuthenticated: true,
  closetItems: mockClothingItems,
  outfits: mockOutfits,
  posts: mockPosts,
  challenges: mockChallenges,
  notifications: mockNotifications,
  earnings: mockEarnings,
  unreadNotifications: mockNotifications.filter((n) => !n.is_read).length,
  selectedCategory: "all",
  feedTab: "following",

  login: () =>
    set({
      user: currentUser,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  toggleLike: (postId: string) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              is_liked: !post.is_liked,
              like_count: post.is_liked
                ? post.like_count - 1
                : post.like_count + 1,
            }
          : post
      ),
    })),

  toggleSave: (postId: string) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              is_saved: !post.is_saved,
              save_count: post.is_saved
                ? post.save_count - 1
                : post.save_count + 1,
            }
          : post
      ),
    })),

  toggleItemFavorite: (itemId: string) =>
    set((state) => ({
      closetItems: state.closetItems.map((item) =>
        item.id === itemId
          ? { ...item, is_favorite: !item.is_favorite }
          : item
      ),
    })),

  addClothingItem: (item: ClothingItem) =>
    set((state) => ({
      closetItems: [item, ...state.closetItems],
    })),

  removeClothingItem: (itemId: string) =>
    set((state) => ({
      closetItems: state.closetItems.filter((item) => item.id !== itemId),
    })),

  addOutfit: (outfit: Outfit) =>
    set((state) => ({
      outfits: [outfit, ...state.outfits],
    })),

  markNotificationRead: (notifId: string) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === notifId ? { ...n, is_read: true } : n
      );
      return {
        notifications: updated,
        unreadNotifications: updated.filter((n) => !n.is_read).length,
      };
    }),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
      unreadNotifications: 0,
    })),

  setSelectedCategory: (category: string) =>
    set({ selectedCategory: category }),

  setFeedTab: (tab: "following" | "explore") => set({ feedTab: tab }),

  followUser: (_userId: string) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, following_count: state.user.following_count + 1 }
        : null,
    })),

  unfollowUser: (_userId: string) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, following_count: state.user.following_count - 1 }
        : null,
    })),
}));
