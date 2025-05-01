"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Footer } from "@/components/layout/footer";
import { AquariumStats } from "@/components/aquarium/aquarium-stats";
import { AquariumList } from "@/components/aquarium/aquarium-list";
import { PurchaseModal } from "@/components/aquarium/purchase-modal";
import { CreateAquariumButton } from "@/components/aquarium/create-aquarium-button";
import { BubblesBackground } from "@/components/bubble-background";
import { useBubbles } from "@/hooks/use-bubbles";
import { Search, Filter } from "lucide-react";
import { initialAquariums } from "@/data/mock-aquarium";

export default function AquariumsPage() {
  const [aquariums, setAquariums] = useState(initialAquariums);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [coinBalance, setCoinBalance] = useState(12500);
  const [searchQuery, setSearchQuery] = useState("");

  const bubbles = useBubbles({
    initialCount: 15,
    maxBubbles: 35,
    minSize: 8,
    maxSize: 30,
    minDuration: 10,
    maxDuration: 18,
    interval: 400,
  });

  const handleAddAquarium = () => {
    // Add a new aquarium to the list
    const newAquarium = {
      id: aquariums.length + 1,
      name: `Standard Aquarium ${aquariums.length + 1}`,
      image: "/items/aquarium.png",
      level: 1,
      type: "Default",
      health: 100,
      lastVisited: "Just now",
      fishCount: "0/15",
      rating: 3,
    };

    setAquariums([...aquariums, newAquarium]);
    setCoinBalance((prev) => prev - 3535);
  };

  const filteredAquariums = useMemo(() => {
    if (!searchQuery.trim()) return aquariums;

    return aquariums.filter(
      (aquarium) =>
        aquarium.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aquarium.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [aquariums, searchQuery]);

  const headerRightContent = (
    <div className="bg-blue-600/50 px-4 py-2 rounded-full flex items-center">
      <span className="text-yellow-300 mr-1">🪙</span>
      <span className="text-white font-medium">{coinBalance}</span>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900">
      <BubblesBackground bubbles={bubbles} className="pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <div className=" w-full">
          <PageHeader
            title="My Aquariums"
            backTo="/game"
            backText=""
            rightContent={
              <div className="flex gap-32 md:gap-64">
                {headerRightContent}
                <div className="flex flex-col sm:flex-row items-center justify-between b-6 gap-4">
                  <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search aquariums..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-blue-600/30 border border-blue-400/30 text-white placeholder-blue-200 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  <button className="bg-blue-600/30 border border-blue-400/30 text-white rounded-lg px-4 py-2 flex items-center w-full sm:w-auto justify-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filter
                  </button>
                </div>
              </div>
            }
          />
        </div>

        <main className="flex-grow mx-auto max-w-7xl px-4 py-8 w-full">

          <AquariumStats
            totalAquariums={aquariums.length}
            totalFish={13}
            premiumAquariums={aquariums.filter((a) => a.isPremium).length}
            averageHealth={Math.round(
              aquariums.reduce((acc, curr) => acc + curr.health, 0) /
                aquariums.length
            )}
          />

          <AquariumList aquariums={filteredAquariums} />

          <CreateAquariumButton onClick={() => setShowPurchaseModal(true)} />
        </main>

        <Footer />
      </div>

      {showPurchaseModal && (
        <PurchaseModal
          onClose={() => setShowPurchaseModal(false)}
          onPurchase={handleAddAquarium}
          coinBalance={coinBalance}
        />
      )}
    </div>
  );
}
