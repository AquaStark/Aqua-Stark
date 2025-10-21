import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActiveAquariumState {
  activeAquariumId: string | null;
  playerAddress: string | null;
  setActiveAquariumId: (id: string, playerAddress?: string) => void;
  clearAquarium: () => void;
}

export const useActiveAquarium = create<ActiveAquariumState>()(
  persist(
    set => ({
      activeAquariumId: null,
      playerAddress: null,
      setActiveAquariumId: (id, playerAddress) =>
        set({ activeAquariumId: id, playerAddress }),
      clearAquarium: () => set({ activeAquariumId: null, playerAddress: null }),
    }),
    {
      name: 'aqua-active-aquarium',
    }
  )
);
