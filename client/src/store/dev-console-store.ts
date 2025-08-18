/**
 * Dev Console Store - Centralized state management for the development console
 */

import { create } from 'zustand';
import { ResponsePanelState } from '@/components/game/dev-console';

interface FormInputState {
  // Player inputs
  username: string;
  playerAddress: string;

  // Aquarium inputs
  aquariumId: string;
  maxCapacity: string;
  maxDecorations: string;
  aquariumOwnerId: string;

  // Fish inputs
  fishId: string;
  fishSpecies: string;
  ownerId: string;
  offspringFishId: string;

  // Decoration inputs
  decorationId: string;
  decorationName: string;
  decorationDesc: string;
  decorationPrice: string;
  decorationRarity: string;
  decorationOwnerId: string;

  // Breeding inputs
  parent1Id: string;
  parent2Id: string;

  // Movement inputs
  fromAquariumId: string;
  toAquariumId: string;

  // Genealogy inputs
  generation: string;
}

interface DevConsoleState extends FormInputState {
  // Response state
  responseState: ResponsePanelState;

  // Actions for updating form inputs
  setFormInput: <K extends keyof FormInputState>(
    field: K,
    value: FormInputState[K]
  ) => void;

  // Actions for response state
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setResponse: (response: object | null) => void;
  resetResponseState: () => void;

  // Batch update actions
  updateResponseState: (state: Partial<ResponsePanelState>) => void;
  resetFormInputs: () => void;
}

// Default form values
const defaultFormInputs: FormInputState = {
  username: 'test_player',
  playerAddress: '',
  aquariumId: '1',
  maxCapacity: '10',
  maxDecorations: '10',
  aquariumOwnerId: '',
  fishId: '1',
  fishSpecies: 'GoldFish',
  ownerId: '',
  offspringFishId: '',
  decorationId: '1',
  decorationName: 'decoration',
  decorationDesc: 'a cool decoration',
  decorationPrice: '100',
  decorationRarity: '1',
  decorationOwnerId: '',
  parent1Id: '',
  parent2Id: '',
  fromAquariumId: '',
  toAquariumId: '',
  generation: '',
};

// Default response state
const defaultResponseState: ResponsePanelState = {
  loading: false,
  error: null,
  response: null,
};

export const useDevConsoleStore = create<DevConsoleState>(set => ({
  // Initialize with default values
  ...defaultFormInputs,
  responseState: defaultResponseState,

  // Form input actions
  setFormInput: (field, value) =>
    set(() => ({
      [field]: value,
    })),

  // Response state actions
  setLoading: loading =>
    set(state => ({
      responseState: { ...state.responseState, loading },
    })),

  setError: error =>
    set(state => ({
      responseState: {
        ...state.responseState,
        error,
        loading: false,
        response: null,
      },
    })),

  setResponse: response =>
    set(state => ({
      responseState: {
        ...state.responseState,
        response,
        loading: false,
        error: null,
      },
    })),

  resetResponseState: () =>
    set(() => ({
      responseState: defaultResponseState,
    })),

  updateResponseState: newState =>
    set(state => ({
      responseState: { ...state.responseState, ...newState },
    })),

  resetFormInputs: () =>
    set(() => ({
      ...defaultFormInputs,
    })),
}));

/**
 * Helper hooks for specific form sections
 */

export const usePlayerFormInputs = () => {
  const store = useDevConsoleStore();
  return {
    username: store.username,
    setUsername: (value: string) => store.setFormInput('username', value),
    playerAddress: store.playerAddress,
    setPlayerAddress: (value: string) =>
      store.setFormInput('playerAddress', value),
  };
};

export const useAquariumFormInputs = () => {
  const store = useDevConsoleStore();
  return {
    aquariumId: store.aquariumId,
    setAquariumId: (value: string) => store.setFormInput('aquariumId', value),
    maxCapacity: store.maxCapacity,
    setMaxCapacity: (value: string) => store.setFormInput('maxCapacity', value),
    maxDecorations: store.maxDecorations,
    setMaxDecorations: (value: string) =>
      store.setFormInput('maxDecorations', value),
    aquariumOwnerId: store.aquariumOwnerId,
    setAquariumOwnerId: (value: string) =>
      store.setFormInput('aquariumOwnerId', value),
  };
};

export const useFishFormInputs = () => {
  const store = useDevConsoleStore();
  return {
    fishId: store.fishId,
    setFishId: (value: string) => store.setFormInput('fishId', value),
    fishSpecies: store.fishSpecies,
    setFishSpecies: (value: string) => store.setFormInput('fishSpecies', value),
    ownerId: store.ownerId,
    setOwnerId: (value: string) => store.setFormInput('ownerId', value),
    aquariumId: store.aquariumId,
    setAquariumId: (value: string) => store.setFormInput('aquariumId', value),
  };
};

export const useDecorationFormInputs = () => {
  const store = useDevConsoleStore();
  return {
    decorationId: store.decorationId,
    setDecorationId: (value: string) =>
      store.setFormInput('decorationId', value),
    decorationName: store.decorationName,
    setDecorationName: (value: string) =>
      store.setFormInput('decorationName', value),
    decorationDesc: store.decorationDesc,
    setDecorationDesc: (value: string) =>
      store.setFormInput('decorationDesc', value),
    decorationPrice: store.decorationPrice,
    setDecorationPrice: (value: string) =>
      store.setFormInput('decorationPrice', value),
    decorationRarity: store.decorationRarity,
    setDecorationRarity: (value: string) =>
      store.setFormInput('decorationRarity', value),
    decorationOwnerId: store.decorationOwnerId,
    setDecorationOwnerId: (value: string) =>
      store.setFormInput('decorationOwnerId', value),
    aquariumId: store.aquariumId,
    setAquariumId: (value: string) => store.setFormInput('aquariumId', value),
  };
};

export const useBreedingFormInputs = () => {
  const store = useDevConsoleStore();
  return {
    parent1Id: store.parent1Id,
    setParent1Id: (value: string) => store.setFormInput('parent1Id', value),
    parent2Id: store.parent2Id,
    setParent2Id: (value: string) => store.setFormInput('parent2Id', value),
  };
};

export const useMovementFormInputs = () => {
  const store = useDevConsoleStore();
  return {
    fishId: store.fishId,
    setFishId: (value: string) => store.setFormInput('fishId', value),
    decorationId: store.decorationId,
    setDecorationId: (value: string) =>
      store.setFormInput('decorationId', value),
    fromAquariumId: store.fromAquariumId,
    setFromAquariumId: (value: string) =>
      store.setFormInput('fromAquariumId', value),
    toAquariumId: store.toAquariumId,
    setToAquariumId: (value: string) =>
      store.setFormInput('toAquariumId', value),
  };
};

export const useGenealogyFormInputs = () => {
  const store = useDevConsoleStore();
  return {
    fishId: store.fishId,
    setFishId: (value: string) => store.setFormInput('fishId', value),
    offspringFishId: store.offspringFishId,
    setOffspringFishId: (value: string) =>
      store.setFormInput('offspringFishId', value),
    generation: store.generation,
    setGeneration: (value: string) => store.setFormInput('generation', value),
  };
};

export const useResponseState = () => {
  const store = useDevConsoleStore();
  return {
    responseState: store.responseState,
    setLoading: store.setLoading,
    setError: store.setError,
    setResponse: store.setResponse,
    resetResponseState: store.resetResponseState,
    updateResponseState: store.updateResponseState,
  };
};
