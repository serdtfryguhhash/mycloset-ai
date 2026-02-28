"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, Heart, MessageCircle, UserPlus, Trophy, DollarSign, Award, MousePointerClick, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";

const typeIcons = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  mention: MessageCircle,
  challenge: Trophy,
  payout: DollarSign,
  badge: Award,
  affiliate_click: MousePointerClick,
};

const typeColors = {
  like: "bg-red-100 text-red-500",
  comment: "bg-blue-100 text-blue-500",
  follow: "bg-purple-100 text-purple-500",
  mention: "bg-cyan-100 text-cyan-500",
  challenge: "bg-amber-100 text-amber-500",
  payout: "bg-green-100 text-green-500",
  badge: "bg-pink-100 text-pink-500",
  affiliate_click: "bg-emerald-100 text-emerald-500",
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotifications } = useStore();

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-24 lg:pb-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-sora font-bold mb-1">Notifications</h1>
            <p className="text-gray-500">
              {unreadNotifications > 0 ? `${unreadNotifications} unread` : "All caught up!"}
            </p>
          </div>
          {unreadNotifications > 0 && (
            <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
              <Check className="w-4 h-4 mr-1" /> Mark all read
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {notifications.map((notif, i) => {
            const Icon = typeIcons[notif.type];
            const colorClass = typeColors[notif.type];

            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={notif.link}>
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className={cn(
                      "w-full flex items-start space-x-4 p-4 rounded-2xl transition-all text-left",
                      notif.is_read
                        ? "bg-white hover:bg-gray-50"
                        : "bg-primary/5 hover:bg-primary/10 border border-primary/10"
                    )}
                  >
                    <div className="relative flex-shrink-0">
                      {notif.actor ? (
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={notif.actor.avatar_url} />
                          <AvatarFallback>{notif.actor.display_name[0]}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", colorClass)}>
                          <Icon className="w-6 h-6" />
                        </div>
                      )}
                      {notif.actor && (
                        <div className={cn("absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white", colorClass)}>
                          <Icon className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm", !notif.is_read && "font-medium")}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(notif.created_at)}</p>
                    </div>

                    {!notif.is_read && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No notifications yet</h3>
            <p className="text-gray-400">When something happens, you will see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}
