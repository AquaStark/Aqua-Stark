"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

import { fishData } from "@/data/mock-game";
import { StoreHeader } from "@/components/store/store-header";
import { StoreTabs } from "@/components/store/store-tabs";
import { StoreCategories } from "@/components/store/store-categories";
import { StoreGrid } from "@/components/store/store-grid";
import { PaginationControls } from "@/components/store/pagination-controls";

export default function StorePage() {
  const [activeTab, setActiveTab] = useState("fish");
  const [activeCategory, setActiveCategory] = useState("specials");
  const [bubbles, setBubbles] = useState<
    Array<{
      id: number;
      size: number;
      left: number;
      animationDuration: number;
    }>
  >([]);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createBubbles = () => {
      const newBubbles = Array.from({ length: 30 }, (_, i) => ({
        id: Date.now() + i,
        size: Math.random() * 30 + 10,
        left: Math.random() * 100,
        animationDuration: Math.random() * 15 + 5,
      }));
      setBubbles(newBubbles);
    };

    createBubbles();

    const intervalId = setInterval(() => {
      const newBubble = {
        id: Date.now(),
        size: Math.random() * 30 + 10,
        left: Math.random() * 100,
        animationDuration: Math.random() * 15 + 5,
      };

      setBubbles((prev) => {
        const filtered = prev.length > 50 ? prev.slice(-50) : prev;
        return [...filtered, newBubble];
      });
    }, 300);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 relative overflow-hidden">
      {/* Header */}
      <StoreHeader />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
          Aqua Stark Store
        </h1>

        <div className="bg-blue-600 rounded-t-3xl overflow-hidden border-2 border-blue-400/50 max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex">
            <StoreTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <button className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-full ml-auto mr-2 mt-2">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <StoreCategories
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            <StoreGrid items={fishData} />

            <PaginationControls />
          </div>
        </div>
      </main>

      <footer
        ref={footerRef}
        className="bg-blue-800 py-6 border-t-2 border-blue-400/50 mt-12 relative"
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/80 mb-2">
            © 2025 Aqua Stark - All rights reserved
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link
              to="#"
              className="text-white hover:text-blue-200 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-white hover:text-blue-200 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="#"
              className="text-white hover:text-blue-200 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Bubbles container */}
        <div
          className="absolute inset-x-0 bottom-0 overflow-hidden"
          style={{ height: "100vh" }}
        >
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: `${bubble.left}%`,
                bottom: "0",
                background:
                  "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2))",
                animation: `footer-float-up ${bubble.animationDuration}s ease-in infinite`,
              }}
            />
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes footer-float-up {
          0% { transform: translateY(0) scale(1); opacity: 0.8; }
          50% { transform: translateY(-50vh) scale(1.1); opacity: 0.5; }
          100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
