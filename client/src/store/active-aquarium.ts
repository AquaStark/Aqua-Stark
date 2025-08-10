import { create } from 'zustand';

interface ActiveAquariumState {
  activeAquariumId: string | null;
  setActiveAquariumId: (id: string) => void;
}

export const useActiveAquarium = create<ActiveAquariumState>(set => ({
  activeAquariumId: null,
  setActiveAquariumId: id => set({ activeAquariumId: id }),
}));
