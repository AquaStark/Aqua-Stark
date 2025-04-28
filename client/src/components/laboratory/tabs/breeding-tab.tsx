"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import { FishSelection } from "@/components/laboratory/fish-selection";
import { BreedingTank } from "@/components/laboratory/breeding-tank";
import { FishDetails } from "@/components/laboratory/fish-details";
import type { Fish } from "@/types/fish";
import { breedingResults } from "@/data/fish-data";

interface BreedingTabProps {
  filteredFish: Fish[];
}

export function BreedingTab({ filteredFish }: BreedingTabProps) {
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);
  const [breedingPair, setBreedingPair] = useState({
    father: null,
    mother: null,
  });

  // Handle fish selection for breeding
  const selectFishForBreeding = (fish: Fish, role: "father" | "mother") => {
    // Check if fish is on cooldown
    if (fish.breedingCooldown && fish.breedingCooldown !== "Ready") {
      return; // Fish is on cooldown
    }

    setBreedingPair((prev) => ({
      ...prev,
      [role]: fish,
    }));
  };

  // Reset breeding process
  const resetBreeding = () => {
    setBreedingPair({ father: null, mother: null });
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Breeding Laboratory</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-blue-800/50 border-blue-700/50 text-white hover:bg-blue-700/70"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Tank
          </Button>
        </div>
      </div>

      {/* Breeding interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Fish selection */}
        <FishSelection
          filteredFish={filteredFish}
          onSelectFish={setSelectedFish}
        />

        {/* Middle column - Breeding tank */}
        <BreedingTank
          breedingPair={breedingPair}
          onReset={resetBreeding}
          breedingResults={breedingResults}
        />

        {/* Right column - Fish details */}
        <FishDetails
          selectedFish={selectedFish}
          onSelectForBreeding={selectFishForBreeding}
        />
      </div>
    </>
  );
}
