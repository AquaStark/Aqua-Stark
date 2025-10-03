import { MOCK_AQUARIUMS } from '@/constants';
import { AquariumData } from '@/types';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { useState } from 'react';
import { Account, AccountInterface } from 'starknet';

/**
 * A custom hook to manage aquarium-related state and interactions, including selecting an aquarium,
 * viewing all fishes, and creating new aquariums via the Dojo SDK client.
 *
 * @returns {{
 * selectedAquarium: AquariumData,
 * handleAquariumChange: (aquarium?: (typeof MOCK_AQUARIUMS)[0]) => void,
 * aquariums: (typeof MOCK_AQUARIUMS),
 * handleNewAquarium: (account: Account | AccountInterface, owner: string, maxCapacity: number) => Promise<any>
 * }} An object containing the selected aquarium state, handler functions, and the list of all aquariums.
 *
 * @example
 * ```tsx
 * import { useAquarium } from '@/hooks/useAquarium';
 *
 * function AquariumViewer() {
 * const { selectedAquarium, handleAquariumChange, aquariums, handleNewAquarium } = useAquarium();
 *
 * const createAquarium = async () => {
 * // Assuming you have an account object and capacity value
 * try {
 * await handleNewAquarium(myAccount, 'my_owner_address', 10);
 * console.log('Aquarium created successfully!');
 * } catch (error) {
 * console.error('Creation failed:', error);
 * }
 * };
 *
 * return (
 * <div>
 * <h1>{selectedAquarium.name}</h1>
 * {selectedAquarium.fishes.map(fish => <p key={fish.id}>{fish.name}</p>)}
 * <button onClick={() => handleAquariumChange(aquariums[1])}>
 * Select Aquarium 2
 * </button>
 * <button onClick={() => handleAquariumChange()}>
 * View All Aquariums
 * </button>
 * </div>
 * );
 * }
 * ```
 */
export function useAquarium() {
  const { client } = useDojoSDK();
  const [selectedAquarium, setSelectedAquarium] = useState(MOCK_AQUARIUMS[0]);
  const mergedAquariums: AquariumData = {
    id: 0,
    name: 'View All',
    fishes: [],
  };

  mergedAquariums.fishes = MOCK_AQUARIUMS.flatMap(aquarium => aquarium.fishes);

  /**
   * Handles the selection of a specific aquarium or the "View All" state.
   * If an aquarium object is provided, it sets the selected aquarium to that object.
   * If no object is provided, it sets the selected aquarium to a merged list of all fishes from all aquariums.
   *
   * @param {(typeof MOCK_AQUARIUMS)[0]} [aquarium] - The aquarium to be selected. Optional.
   * @returns {void}
   */
  const handleAquariumChange = (aquarium?: (typeof MOCK_AQUARIUMS)[0]) => {
    if (aquarium) {
      setSelectedAquarium(aquarium);
    } else {
      setSelectedAquarium(mergedAquariums);
    }
  };

  /**
   * Calls the `newAquarium` method on the Dojo SDK client to create a new aquarium on the blockchain.
   *
   * @param {Account | AccountInterface} account - The Starknet account to sign and send the transaction.
   * @param {string} owner - The address of the new aquarium's owner.
   * @param {number} maxCapacity - The maximum number of fishes the new aquarium can hold.
   * @returns {Promise<any>} A promise that resolves with the transaction result from the SDK.
   * @throws {Error} Throws an error if the transaction fails.
   */
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
