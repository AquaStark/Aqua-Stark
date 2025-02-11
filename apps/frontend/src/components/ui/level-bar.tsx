import React from "react";
import Image from "next/image";
import ProgressBar from "~/components/ui/progress-bar";
import { mockPlayerData } from "~/lib/constants/mock-data/mock-data-aquarium";

export default function LevelBar() {
  const { playerLevel, playerExperience, maxExperience, profileImage } = mockPlayerData;
  const progressPercentage = (playerExperience / maxExperience) * 100;

  return (
    <div className="relative flex items-center w-full max-w-[500px] h-16">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center z-10 mr-[-12px]">
        <span className="text-blue-500 font-extrabold text-2xl">{playerLevel}</span>
      </div>
      <div className="flex-1 h-7 bg-white rounded-full overflow-hidden">
        <ProgressBar percentage={progressPercentage} color="bg-yellow-400" />
      </div>
      <div className="w-20 h-20 overflow-hidden rounded-full z-10 -ml-5">
        <Image src={profileImage} alt="Profile" width={100} height={100} />
      </div>
    </div>
  );
}
