/**
 * Dev Console Selectors - Typed selectors for efficient state access
 */

import { useDevConsoleStore } from '../dev-console-store';

/**
 * Selector for all form inputs as a single object
 */
export const useAllFormInputs = () => {
  return useDevConsoleStore((state) => ({
    username: state.username,
    playerAddress: state.playerAddress,
    aquariumId: state.aquariumId,
    maxCapacity: state.maxCapacity,
    maxDecorations: state.maxDecorations,
    aquariumOwnerId: state.aquariumOwnerId,
    fishId: state.fishId,
    fishSpecies: state.fishSpecies,
    ownerId: state.ownerId,
    offspringFishId: state.offspringFishId,
    decorationId: state.decorationId,
    decorationName: state.decorationName,
    decorationDesc: state.decorationDesc,
    decorationPrice: state.decorationPrice,
    decorationRarity: state.decorationRarity,
    decorationOwnerId: state.decorationOwnerId,
    parent1Id: state.parent1Id,
    parent2Id: state.parent2Id,
    fromAquariumId: state.fromAquariumId,
    toAquariumId: state.toAquariumId,
    generation: state.generation
  }));
};

/**
 * Selector for player-related inputs
 */
export const selectPlayerInputs = (state: ReturnType<typeof useDevConsoleStore.getState>) => ({
  username: state.username,
  playerAddress: state.playerAddress
});

/**
 * Selector for aquarium-related inputs
 */
export const selectAquariumInputs = (state: ReturnType<typeof useDevConsoleStore.getState>) => ({
  aquariumId: state.aquariumId,
  maxCapacity: state.maxCapacity,
  maxDecorations: state.maxDecorations,
  aquariumOwnerId: state.aquariumOwnerId
});

/**
 * Selector for fish-related inputs
 */
export const selectFishInputs = (state: ReturnType<typeof useDevConsoleStore.getState>) => ({
  fishId: state.fishId,
  fishSpecies: state.fishSpecies,
  ownerId: state.ownerId,
  aquariumId: state.aquariumId
});

/**
 * Selector for decoration-related inputs
 */
export const selectDecorationInputs = (state: ReturnType<typeof useDevConsoleStore.getState>) => ({
  decorationId: state.decorationId,
  decorationName: state.decorationName,
  decorationDesc: state.decorationDesc,
  decorationPrice: state.decorationPrice,
  decorationRarity: state.decorationRarity,
  decorationOwnerId: state.decorationOwnerId,
  aquariumId: state.aquariumId
});

/**
 * Selector for breeding-related inputs
 */
export const selectBreedingInputs = (state: ReturnType<typeof useDevConsoleStore.getState>) => ({
  parent1Id: state.parent1Id,
  parent2Id: state.parent2Id
});

/**
 * Selector for movement-related inputs
 */
export const selectMovementInputs = (state: ReturnType<typeof useDevConsoleStore.getState>) => ({
  fishId: state.fishId,
  decorationId: state.decorationId,
  fromAquariumId: state.fromAquariumId,
  toAquariumId: state.toAquariumId
});

/**
 * Selector for genealogy-related inputs
 */
export const selectGenealogyInputs = (state: ReturnType<typeof useDevConsoleStore.getState>) => ({
  fishId: state.fishId,
  offspringFishId: state.offspringFishId,
  generation: state.generation
});

/**
 * Selector for response state
 */
export const selectResponseState = (state: ReturnType<typeof useDevConsoleStore.getState>) => 
  state.responseState;

/**
 * Selector for loading state only
 */
export const selectIsLoading = (state: ReturnType<typeof useDevConsoleStore.getState>) => 
  state.responseState.loading;

/**
 * Selector for error state only
 */
export const selectError = (state: ReturnType<typeof useDevConsoleStore.getState>) => 
  state.responseState.error;

/**
 * Selector for response data only
 */
export const selectResponse = (state: ReturnType<typeof useDevConsoleStore.getState>) => 
  state.responseState.response;

/**
 * Compound selector for validation states
 */
export const useValidationStates = () => {
  return useDevConsoleStore((state) => {
    const hasPlayerAddress = !!state.playerAddress;
    const hasAquariumId = !!state.aquariumId && state.aquariumId !== '0';
    const hasFishId = !!state.fishId && state.fishId !== '0';
    const hasDecorationId = !!state.decorationId && state.decorationId !== '0';
    const hasBreedingParents = !!state.parent1Id && !!state.parent2Id;
    const hasMovementData = (!!state.fromAquariumId && !!state.toAquariumId);
    
    return {
      canRegisterPlayer: !!state.username,
      canGetPlayer: hasPlayerAddress,
      canCreateAquarium: !!state.maxCapacity && !!state.maxDecorations,
      canGetAquarium: hasAquariumId,
      canCreateFish: hasAquariumId && !!state.fishSpecies,
      canGetFish: hasFishId,
      canCreateDecoration: hasAquariumId && !!state.decorationName && !!state.decorationDesc,
      canGetDecoration: hasDecorationId,
      canBreedFishes: hasBreedingParents,
      canMoveFish: hasFishId && hasMovementData,
      canMoveDecoration: hasDecorationId && hasMovementData
    };
  });
};

/**
 * Action selectors for clean access to store actions
 */
export const useDevConsoleActions = () => {
  return useDevConsoleStore((state) => ({
    setFormInput: state.setFormInput,
    setLoading: state.setLoading,
    setError: state.setError,
    setResponse: state.setResponse,
    resetResponseState: state.resetResponseState,
    updateResponseState: state.updateResponseState,
    resetFormInputs: state.resetFormInputs
  }));
};