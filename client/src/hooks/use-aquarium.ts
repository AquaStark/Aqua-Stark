import { useState } from "react"
import { MOCK_AQUARIUMS } from "@/data/game-data"
import { AquariumData } from "@/types/game"

export function useAquarium() {
  const [selectedAquarium, setSelectedAquarium] = useState(MOCK_AQUARIUMS[0])
  const mergedAquariums: AquariumData = {
    id: 0,
    name: "View All",
    fishes: [],
  };

  mergedAquariums.fishes = MOCK_AQUARIUMS.flatMap(
    (aquarium) => aquarium.fishes
  );

  const handleAquariumChange = (aquarium?: (typeof MOCK_AQUARIUMS)[0]) => {
    if (aquarium) {
      setSelectedAquarium(aquarium);
    } else {
      setSelectedAquarium(mergedAquariums);
    }
  };

  return {
    selectedAquarium,
    handleAquariumChange,
    aquariums: MOCK_AQUARIUMS,
  }
}
