import { create } from "zustand"
import type { Fish, MarketFilter } from "../types/market"

interface MarketState {
  selectedFish: Fish | null
  showBidModal: boolean
  showOfferModal: boolean
  showListingModal: boolean
  bidAmount: number
  filters: MarketFilter
  showFilters: boolean

  // Actions
  setSelectedFish: (fish: Fish | null) => void
  setShowBidModal: (show: boolean) => void
  setShowOfferModal: (show: boolean) => void
  setShowListingModal: (show: boolean) => void
  setBidAmount: (amount: number) => void
  setFilters: (filters: Partial<MarketFilter>) => void
  setShowFilters: (show: boolean) => void
  resetFilters: () => void
}

const defaultFilters: MarketFilter = {
  search: "",
  rarity: [],
  minPrice: 0,
  maxPrice: 10000,
  traits: [],
  listingType: "all",
  sort: "newest",
}

export const useMarketStore = create<MarketState>((set) => ({
  selectedFish: null,
  showBidModal: false,
  showOfferModal: false,
  showListingModal: false,
  bidAmount: 0,
  filters: defaultFilters,
  showFilters: false,

  // Actions
  setSelectedFish: (fish) => set({ selectedFish: fish }),
  setShowBidModal: (show) => set({ showBidModal: show }),
  setShowOfferModal: (show) => set({ showOfferModal: show }),
  setShowListingModal: (show) => set({ showListingModal: show }),
  setBidAmount: (amount) => set({ bidAmount: amount }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  setShowFilters: (show) => set({ showFilters: show }),
  resetFilters: () => set({ filters: defaultFilters }),
}))

