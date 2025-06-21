import { MOCK_AQUARIUMS } from "@/data/game-data";
import { AquariumData } from "@/types/game";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { useState } from "react";
import { Account, AccountInterface } from "starknet";

export function useAquarium() {
  const { client } = useDojoSDK();
  console.log("client", client);
  const [selectedAquarium, setSelectedAquarium] = useState(MOCK_AQUARIUMS[0]);
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

  const handleNewAquarium = async (
    account: Account | AccountInterface,
    owner: string,
    maxCapacity: number
  ) => {
    try {
      const res = await client.AquaStark.newAquarium(
        account,
        owner,
        maxCapacity
      );
      return res;
    } catch (error) {
      console.log("error creating aquarium", error);
    }
  };

  return {
    selectedAquarium,
    handleAquariumChange,
    aquariums: MOCK_AQUARIUMS,
    handleNewAquarium,
  };
}
