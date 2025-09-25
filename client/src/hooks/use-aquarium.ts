import { MOCK_AQUARIUMS } from '@/constants';
import { AquariumData } from '@/types';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { useState } from 'react';
import { Account, AccountInterface } from 'starknet';

export function useAquarium() {
  const { client } = useDojoSDK();
  const [selectedAquarium, setSelectedAquarium] = useState(MOCK_AQUARIUMS[0]);
  const mergedAquariums: AquariumData = {
    id: 0,
    name: 'View All',
    fishes: [],
  };

  mergedAquariums.fishes = MOCK_AQUARIUMS.flatMap(aquarium => aquarium.fishes);

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
      console.error('Failed to create new aquarium:', error);
      // Could add user notification for aquarium creation failures
      throw error;
    }
  };

  return {
    selectedAquarium,
    handleAquariumChange,
    aquariums: MOCK_AQUARIUMS,
    handleNewAquarium,
  };
}
