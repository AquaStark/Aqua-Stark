import { mockAquariums, mockEvents } from '@/data/mock-community';
import {
  defaultEventFilters,
  defaultGalleryFilters,
  useCommunityStore,
} from '@/store/community';
import { useDebounce } from './use-debounce';

/**
 * @file use-community.ts
 * @description
 * A custom hook for managing state and logic related to the community section of the application.
 * It handles filtering and sorting of mock aquarium and event data based on user input,
 * utilizing a debounced search to optimize performance.
 *
 * @category Hooks
 */

/**
 * A custom hook that manages community-related data, including filtering and sorting aquariums and events.
 * It integrates with a Zustand store (`useCommunityStore`) to manage filter states and uses a
 * custom `useDebounce` hook to improve search performance.
 *
 * @returns {{
 * showFilters: boolean,
 * setShowFilters: (show: boolean) => void,
 * filters: any,
 * setFilters: (filters: any) => void,
 * eventFilters: any,
 * setEventFilters: (filters: any) => void,
 * filteredAquariums: any[],
 * filteredEvents: any[],
 * sortedEvents: any[],
 * sortedAquariums: any[],
 * resetFilters: () => void,
 * }} An object containing state, filter and sort methods, and the processed data.
 *
 * @example
 * ```tsx
 * import { useCommunity } from '@/hooks/use-community';
 *
 * function CommunityPage() {
 * const {
 * sortedAquariums,
 * sortedEvents,
 * showFilters,
 * setShowFilters,
 * resetFilters,
 * setFilters,
 * } = useCommunity();
 *
 * return (
 * <div>
 * <h1>Community Hub</h1>
 * <button onClick={() => setShowFilters(!showFilters)}>Toggle Filters</button>
 * <button onClick={resetFilters}>Reset All Filters</button>
 *
 * <h2>Aquariums</h2>
 * // Render sortedAquariums
 *
 * <h2>Events</h2>
 * // Render sortedEvents
 * </div>
 * );
 * }
 * ```
 */
export const useCommunity = () => {
  const {
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    eventFilters,
    setEventFilters,
  } = useCommunityStore();

  // Debounce search queries for better performance
  const { debouncedValue: debouncedGallerySearch } = useDebounce(
    filters.search,
    { delay: 300 }
  );
  const { debouncedValue: debouncedEventSearch } = useDebounce(
    eventFilters.search,
    { delay: 300 }
  );

  /**
   * Filters the mock aquariums data based on the current gallery filters.
   * Filters by search query, min/max likes, and min/max comments.
   * @returns {any[]} The array of filtered aquariums.
   */
  const filteredAquariums = mockAquariums.filter(aquarium => {
    if (
      debouncedGallerySearch &&
      !aquarium.name
        .toLowerCase()
        .includes(debouncedGallerySearch.toLowerCase())
    ) {
      return false;
    }
    if (
      !(aquarium.likes > filters.minLikes && aquarium.likes < filters.maxLikes)
    ) {
      return false;
    }
    if (
      !(
        aquarium.comments > filters.minComments &&
        aquarium.comments < filters.maxComments
      )
    ) {
      return false;
    }
    return true;
  });

  /**
   * Sorts the filtered aquariums array based on the current sort criteria.
   * Sorting options include name, owner, likes (high/low), and recent timestamp.
   * @returns {any[]} The array of sorted aquariums.
   */
  const sortedAquariums = [...filteredAquariums].sort((a, b) => {
    switch (filters.sort) {
      case 'name': {
        return a.name.localeCompare(b.name);
      }
      case 'owner': {
        return a.owner.localeCompare(b.owner);
      }
      case 'likes-high': {
        return b.likes - a.likes;
      }
      case 'likes-low': {
        return a.likes - b.likes;
      }
      case 'recent': {
        if (!a.timeStamp) {
          return 1;
        }
        if (!b.timeStamp) {
          return -1;
        }
        const aDate = new Date(a.timeStamp);
        const bDate = new Date(b.timeStamp);
        return bDate.getTime() - aDate.getTime();
      }
      default:
        return 0;
    }
  });

  /**
   * Filters the mock events data based on the current event filters.
   * Filters by search query, min/max participants, and event status.
   * @returns {any[]} The array of filtered events.
   */
  const filteredEvents = mockEvents.filter(event => {
    if (
      debouncedEventSearch &&
      !event.name.toLowerCase().includes(debouncedEventSearch.toLowerCase()) &&
      !event.description
        .toLowerCase()
        .includes(debouncedEventSearch.toLowerCase())
    ) {
      return false;
    }
    if (
      !(
        event.participants > eventFilters.minParticipants &&
        event.participants < eventFilters.maxParticipants
      )
    ) {
      return false;
    }
    if (eventFilters.status !== 'all' && event.status !== eventFilters.status) {
      return false;
    }
    return true;
  });

  /**
   * Sorts the filtered events array based on the current sort criteria.
   * Sorting options include name, participants, and recent end date.
   * @returns {any[]} The array of sorted events.
   */
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (eventFilters.sort) {
      case 'name': {
        return a.name.localeCompare(b.name);
      }
      case 'participants': {
        return b.participants - a.participants;
      }
      case 'recent': {
        if (!a.endDate) {
          return 1;
        }
        if (!b.endDate) {
          return -1;
        }
        const aDate = new Date(a.endDate);
        const bDate = new Date(b.endDate);
        return bDate.getTime() - aDate.getTime();
      }
      default:
        return 0;
    }
  });

  /**
   * Resets all filters for both aquariums and events to their default values.
   * It also updates a unique key to force a re-render or re-initialization of components.
   * @returns {void}
   */
  const resetFilters = () => {
    setFilters({
      ...defaultGalleryFilters,
      key: filters.key + 1,
    });
    setEventFilters({
      ...defaultEventFilters,
      key: filters.key + 1,
    });
  };

  return {
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    eventFilters,
    setEventFilters,
    filteredAquariums,
    filteredEvents,
    sortedEvents,
    sortedAquariums,
    resetFilters,
  };
};
