import { mockAquariums, mockEvents } from "@/data/mock-community";
import {
  defaultEventFilters,
  defaultGalleryFilters,
  useCommunityStore,
} from "@/store/community";

export const useCommunity = () => {
  const {
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    eventFilters,
    setEventFilters,
  } = useCommunityStore();

  const filteredAquariums = mockAquariums.filter((aquarium) => {
    if (
      filters.search &&
      !aquarium.name.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    if (
      !(aquarium.likes > filters.minLikes && aquarium.likes < filters.maxLikes)
    )
      return false;
    if (
      !(
        aquarium.comments > filters.minComments &&
        aquarium.comments < filters.maxComments
      )
    )
      return false;
    return true;
  });

  const sortedAquariums = [...filteredAquariums].sort((a, b) => {
    switch (filters.sort) {
      case "name":
        return a.name.localeCompare(b.name);
      case "owner":
        return a.owner.localeCompare(b.owner);
      case "likes-high":
        return b.likes - a.likes;
      case "likes-low":
        return a.likes - b.likes;
      case "recent":
        if (!a.timeStamp) return 1;
        if (!b.timeStamp) return -1;
        const aDate = new Date(a.timeStamp);
        const bDate = new Date(b.timeStamp);
        return bDate.getTime() - aDate.getTime();
      default:
        return 0;
    }
  });

  const filteredEvents = mockEvents.filter((event) => {
    if (
      eventFilters.search &&
      !event.name.toLowerCase().includes(eventFilters.search.toLowerCase()) &&
      !event.description
        .toLowerCase()
        .includes(eventFilters.search.toLowerCase())
    ) {
      return false;
    }
    if (
      !(
        event.participants > eventFilters.minParticipants &&
        event.participants < eventFilters.maxParticipants
      )
    )
      return false;
    if (eventFilters.status !== "all" && event.status !== eventFilters.status)
      return false;
    return true;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (eventFilters.sort) {
      case "name":
        return a.name.localeCompare(b.name);
      case "participants":
        return b.participants - a.participants;
      case "recent":
        if (!a.endDate) return 1;
        if (!b.endDate) return -1;
        const aDate = new Date(a.endDate);
        const bDate = new Date(b.endDate);
        return bDate.getTime() - aDate.getTime();
      default:
        return 0;
    }
  });

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
