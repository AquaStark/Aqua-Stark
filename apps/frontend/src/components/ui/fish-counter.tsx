import React from "react";
import Image from "next/image";
import { mockAquariumStats } from "~/lib/constants/mock-data/mock-data-aquarium";

export default function FishCounter() {
  return (
    <div className="flex items-center">
      <Image src="/icons/fish.png" alt="Fish Count" width={36} height={36} unoptimized />
      <span className="text-blue-900 font-extrabold text-2xl ml-3">
        {mockAquariumStats.currentFish} / {mockAquariumStats.maxFish}
      </span>
    </div>
  );
}
