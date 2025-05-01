import { create } from "zustand";

export interface CommunityGalleryFilter {
  key: number;
  search: string;
  sort: "name" | "owner" | "likes-high" | "likes-low" | "recent";
  minLikes: number;
  maxLikes: number;
  minComments: number;
  maxComments: number;
}

export interface CommunityEventsFilter {
  key: number;
  search: string;
  sort: "name" | "participants" | "recent" | "";
  minParticipants: number;
  maxParticipants: number;
  startDate?: string;
  endDate?: string;
  status?: "active" | "upcoming" | "past" | "all";
}

export const defaultGalleryFilters: CommunityGalleryFilter = {
  key: 0,
  search: "",
  sort: "name",
  minLikes: 0,
  maxLikes: 1000,
  minComments: 0,
  maxComments: 100,
};

export const defaultEventFilters: CommunityEventsFilter = {
  key: 0,
  search: "",
  sort: "",
  minParticipants: 0,
  maxParticipants: 100,
  status: "all",
};

interface CommunityState {
  filters: CommunityGalleryFilter;
  eventFilters: CommunityEventsFilter;
  showFilters: boolean;

  // Actions
  setShowFilters: (show: boolean) => void;
  setFilters: (filters: Partial<CommunityGalleryFilter>) => void;
  setEventFilters: (filters: Partial<CommunityEventsFilter>) => void;
  resetFilters: () => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  selectedFish: null,
  show: false,
  showOfferModal: false,
  showListingModal: false,
  bidAmount: 0,
  filters: defaultGalleryFilters,
  eventFilters: defaultEventFilters,
  showFilters: false,

  // Actions
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  setEventFilters: (filters) =>
    set((state) => ({
      eventFilters: { ...state.eventFilters, ...filters },
    })),
  setShowFilters: (show) => set({ showFilters: show }),
  resetFilters: () =>
    set({ filters: defaultGalleryFilters, eventFilters: defaultEventFilters }),
}));
