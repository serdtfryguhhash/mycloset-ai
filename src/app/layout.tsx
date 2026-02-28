import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyCloset.ai - AI-Powered Closet Manager & Outfit Creator",
  description:
    "Digitize your wardrobe, get AI-powered outfit suggestions, share your style, and earn through fashion affiliate commerce.",
  keywords:
    "fashion, AI, closet, outfit, style, wardrobe, social, commerce, affiliate",
  openGraph: {
    title: "MyCloset.ai - AI-Powered Closet Manager",
    description: "Your AI-powered fashion companion",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen">
        <Navbar />
        <main>{children}</main>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1C1917",
              color: "#fff",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
