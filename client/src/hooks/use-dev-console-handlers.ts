/**
 * Custom hook that encapsulates all dev console handlers
 */

import { useCallback } from 'react';
import { useAccount } from '@starknet-react/core';
import { useAquarium } from '@/hooks/dojo/useAquarium';
import { useDecoration } from '@/hooks/dojo/useDecoration';
import { useFish } from '@/hooks/dojo/useFish';
import { usePlayer } from '@/hooks/dojo/usePlayer';
import { handleContractRequest } from '@/systems/contract-request-system';
import { GameDataTransformer, createFishSpeciesEnum, safeParseInt } from '@/systems/data-transformation-system';
import { useDevConsoleStore } from '@/store/dev-console-store';

export const useDevConsoleHandlers = () => {
  const { account } = useAccount();
  const { registerPlayer, getPlayer, isVerified } = usePlayer();
  const {
    getAquarium,
    newAquarium,
    getAquariumOwner,
    moveFishToAquarium,
    moveDecorationToAquarium,
  } = useAquarium();
  const { getDecoration, newDecoration, getDecorationOwner } = useDecoration();
  const {
    getFish,
    newFish,
    breedFishes,
    getFishOwner,
    getFishParents,
    getFishOffspring,
    getFishAncestor,
    getFishFamilyTree,
  } = useFish();

  const state = useDevConsoleStore();
  const { setError, setResponse, updateResponseState } = state;

  const handleRequest = useCallback(
    async <T,>(request: () => Promise<T>, name: string) => {
      await handleContractRequest(request, name, {
        onStart: () => updateResponseState({ loading: true, error: null, response: null }),
        onSuccess: (result) => setResponse(result as object),
        onError: (error) => setError(error),
      });
    },
    [updateResponseState, setResponse, setError]
  );

  // Player handlers
  const handleRegisterPlayer = useCallback(() => {
    if (!account) return;
    handleRequest(() => registerPlayer(account, state.username), 'registerPlayer');
  }, [account, handleRequest, registerPlayer, state.username]);

  const handleGetPlayer = useCallback(() => {
    if (!account) return;
    handleRequest(
      () => getPlayer(state.playerAddress || account.address),
      'getPlayer'
    );
  }, [account, handleRequest, getPlayer, state.playerAddress]);

  const handleIsVerified = useCallback(() => {
    if (!state.playerAddress) {
      setError('Player address required');
      return;
    }
    handleRequest(() => isVerified(state.playerAddress), 'isVerified');
  }, [handleRequest, isVerified, state.playerAddress, setError]);

  // Aquarium handlers
  const handleNewAquarium = useCallback(() => {
    if (!account) return;
    const result = GameDataTransformer.transformAquariumData({
      maxCapacity: state.maxCapacity,
      maxDecorations: state.maxDecorations
    });
    
    if (!result.success) {
      setError(result.error || 'Invalid aquarium data');
      return;
    }
    
    handleRequest(
      () => newAquarium(account, account.address, result.data!.maxCapacity, result.data!.maxDecorations),
      'newAquarium'
    );
  }, [account, handleRequest, newAquarium, state.maxCapacity, state.maxDecorations, setError]);

  const handleGetAquarium = useCallback(() => {
    const result = safeParseInt(state.aquariumId, 'Aquarium ID', 1);
    if (!result.success) {
      setError(result.error || 'Invalid aquarium ID');
      return;
    }
    handleRequest(() => getAquarium(result.value!), 'getAquarium');
  }, [handleRequest, getAquarium, state.aquariumId, setError]);

  const handleGetAquariumOwner = useCallback(() => {
    const result = safeParseInt(state.aquariumOwnerId, 'Aquarium ID', 1);
    if (!result.success) {
      setError(result.error || 'Invalid aquarium ID');
      return;
    }
    handleRequest(() => getAquariumOwner(result.value!), 'getAquariumOwner');
  }, [handleRequest, getAquariumOwner, state.aquariumOwnerId, setError]);

  // Fish handlers
  const handleNewFish = useCallback(() => {
    if (!account) return;
    const species = createFishSpeciesEnum(state.fishSpecies);
    handleRequest(() => newFish(account, state.aquariumId, species), 'newFish');
  }, [account, handleRequest, newFish, state.aquariumId, state.fishSpecies]);

  const handleGetFish = useCallback(() => {
    const result = safeParseInt(state.fishId, 'Fish ID', 1);
    if (!result.success) {
      setError(result.error || 'Invalid fish ID');
      return;
    }
    handleRequest(() => getFish(result.value!), 'getFish');
  }, [handleRequest, getFish, state.fishId, setError]);

  const handleGetFishOwner = useCallback(() => {
    const result = safeParseInt(state.ownerId, 'Fish ID', 1);
    if (!result.success) {
      setError(result.error || 'Invalid fish ID');
      return;
    }
    handleRequest(() => getFishOwner(result.value!), 'getFishOwner');
  }, [handleRequest, getFishOwner, state.ownerId, setError]);

  // Decoration handlers
  const handleNewDecoration = useCallback(() => {
    if (!account) return;
    const result = GameDataTransformer.transformDecorationData({
      name: state.decorationName,
      description: state.decorationDesc,
      price: state.decorationPrice,
      rarity: state.decorationRarity
    });
    
    if (!result.success) {
      setError(result.error || 'Invalid decoration data');
      return;
    }
    
    handleRequest(
      () => newDecoration(
        account,
        parseInt(state.aquariumId),
        result.data!.name as string,
        result.data!.description as string,
        result.data!.price,
        result.data!.rarity
      ),
      'newDecoration'
    );
  }, [account, handleRequest, newDecoration, state, setError]);

  const handleGetDecoration = useCallback(() => {
    const result = safeParseInt(state.decorationId, 'Decoration ID', 1);
    if (!result.success) {
      setError(result.error || 'Invalid decoration ID');
      return;
    }
    handleRequest(() => getDecoration(result.value!), 'getDecoration');
  }, [handleRequest, getDecoration, state.decorationId, setError]);

  const handleGetDecorationOwner = useCallback(() => {
    const result = safeParseInt(state.decorationOwnerId, 'Decoration ID', 1);
    if (!result.success) {
      setError(result.error || 'Invalid decoration ID');
      return;
    }
    handleRequest(() => getDecorationOwner(result.value!), 'getDecorationOwner');
  }, [handleRequest, getDecorationOwner, state.decorationOwnerId, setError]);

  // Breeding handlers
  const handleBreedFishes = useCallback(() => {
    if (!account) return;
    const result = GameDataTransformer.transformBreedingData({
      parent1Id: state.parent1Id,
      parent2Id: state.parent2Id
    });
    
    if (!result.success) {
      setError(result.error || 'Invalid breeding data');
      return;
    }
    
    handleRequest(
      () => breedFishes(account, result.data!.parent1Id, result.data!.parent2Id),
      'breedFishes'
    );
  }, [account, handleRequest, breedFishes, state.parent1Id, state.parent2Id, setError]);

  // Movement handlers
  const handleMoveFish = useCallback(() => {
    if (!account) return;
    const result = GameDataTransformer.transformMovementData({
      itemId: state.fishId,
      fromAquariumId: state.fromAquariumId,
      toAquariumId: state.toAquariumId
    });
    
    if (!result.success) {
      setError(result.error || 'Invalid movement data');
      return;
    }
    
    handleRequest(
      () => moveFishToAquarium(
        account,
        result.data!.itemId,
        result.data!.fromAquariumId,
        result.data!.toAquariumId
      ),
      'moveFishToAquarium'
    );
  }, [account, handleRequest, moveFishToAquarium, state, setError]);

  const handleMoveDecoration = useCallback(() => {
    if (!account) return;
    const result = GameDataTransformer.transformMovementData({
      itemId: state.decorationId,
      fromAquariumId: state.fromAquariumId,
      toAquariumId: state.toAquariumId
    });
    
    if (!result.success) {
      setError(result.error || 'Invalid movement data');
      return;
    }
    
    handleRequest(
      () => moveDecorationToAquarium(
        account,
        result.data!.itemId,
        result.data!.fromAquariumId,
        result.data!.toAquariumId
      ),
      'moveDecorationToAquarium'
    );
  }, [account, handleRequest, moveDecorationToAquarium, state, setError]);

  // Genealogy handlers
  const handleGetParents = useCallback(() => {
    const result = safeParseInt(state.fishId, 'Fish ID', 1);
    if (!result.success) {
      setError(result.error || 'Invalid fish ID');
      return;
    }
    handleRequest(() => getFishParents(result.value!), 'getFishParents');
  }, [handleRequest, getFishParents, state.fishId, setError]);

  const handleGetOffspring = useCallback(() => {
    const result = safeParseInt(state.offspringFishId, 'Fish ID', 1);
    if (!result.success) {
      setError(result.error || 'Invalid fish ID');
      return;
    }
    handleRequest(() => getFishOffspring(result.value!), 'getFishOffspring');
  }, [handleRequest, getFishOffspring, state.offspringFishId, setError]);

  const handleFamilyTree = useCallback(() => {
    const result = safeParseInt(state.fishId, 'Fish ID', 1);
    if (!result.success) {
      setError(result.error || 'Invalid fish ID');
      return;
    }
    handleRequest(() => getFishFamilyTree(result.value!), 'getFishFamilyTree');
  }, [handleRequest, getFishFamilyTree, state.fishId, setError]);

  const handleFishAncestor = useCallback(() => {
    const fishResult = safeParseInt(state.fishId, 'Fish ID', 1);
    const genResult = safeParseInt(state.generation, 'Generation', 0);
    
    if (!fishResult.success) {
      setError(fishResult.error || 'Invalid fish ID');
      return;
    }
    if (!genResult.success) {
      setError(genResult.error || 'Invalid generation');
      return;
    }
    
    handleRequest(
      () => getFishAncestor(fishResult.value!, genResult.value!),
      'getFishAncestor'
    );
  }, [handleRequest, getFishAncestor, state.fishId, state.generation, setError]);

  return {
    state,
    handlers: {
      // Player
      handleRegisterPlayer,
      handleGetPlayer,
      handleIsVerified,
      // Aquarium
      handleNewAquarium,
      handleGetAquarium,
      handleGetAquariumOwner,
      // Fish
      handleNewFish,
      handleGetFish,
      handleGetFishOwner,
      // Decoration
      handleNewDecoration,
      handleGetDecoration,
      handleGetDecorationOwner,
      // Breeding
      handleBreedFishes,
      // Movement
      handleMoveFish,
      handleMoveDecoration,
      // Genealogy
      handleGetParents,
      handleGetOffspring,
      handleFamilyTree,
      handleFishAncestor
    }
  };
};