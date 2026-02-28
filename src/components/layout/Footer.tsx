"use client";

import React from "react";
import Link from "next/link";
import { Shirt, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <span className="font-sora font-bold text-lg">MyCloset.ai</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your AI-powered closet manager, outfit creator, and fashion social commerce platform.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-sora font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {["AI Closet", "Outfit Generator", "Social Feed", "Shop", "Challenges"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sora font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {["About", "Careers", "Blog", "Press", "Partners"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-sora font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "FTC Disclosure", "Cookie Policy", "GDPR"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">&copy; 2026 MyCloset.ai. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Made with love for fashion enthusiasts everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
