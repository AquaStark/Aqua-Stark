export const mockAquariums = [
  {
    id: 1,
    name: 'Tropical Paradise',
    owner: 'CoralQueen',
    timePosted: '3 days ago',
    likes: 120,
    comments: 45,
    featured: true,
    imageUrl: '/textures/backgrounds/Bg2.svg',
  },
  {
    id: 2,
    name: 'Deep Blue Mystery',
    owner: 'ReefMaster',
    likes: 89,
    comments: 12,
    imageUrl: '/textures/backgrounds/Bg2.svg',
  },
  {
    id: 3,
    name: 'Neon Reef Collection',
    owner: 'AquaLover',
    likes: 50,
    comments: 8,
    imageUrl: '/textures/backgrounds/Bg2.svg',
  },
  {
    id: 4,
    name: 'Ancient Sunken Aquarium',
    owner: 'TreasureHunter',
    likes: 78,
    comments: 14,
    imageUrl: '/textures/backgrounds/Bg2.svg',
  },
  // ... más acuarios
];
  
export const mockFriends = [
  { username: "CoralQueen", level: 20, isOnline: true },
  { username: "FishMaster99", level: 15, isOnline: false },
  { username: "OceanExplorer", level: 12, isOnline: true },
  { username: "AquaDesigner", level: 18, isOnline: false },
];

export const mockSuggestions = [
  { username: "AquaFriend2", level: 7, isOnline: true },
  { username: "AquaFriend3", level: 9, isOnline: false },
];
  
export const popularCategories = [
  "Breeding",
  "Decorations",
  "Maintenance",
  "Competitions",
  "Tips & Tricks",
  "Off-Topic",
];

export const recentDiscussions = [
  {
    id: 1,
    title: "Best breeding combinations for rare fish",
    author: "FishMaster99",
    category: "Breeding",
    replies: 12,
    views: 345,
    timestamp: "3 hours ago",
  },
  {
    id: 2,
    title: "How to maintain perfect water quality?",
    author: "CoralQueen",
    category: "Maintenance",
    replies: 8,
    views: 210,
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    title: "Decoration ideas for small aquariums",
    author: "AquaLover",
    category: "Decorations",
    replies: 5,
    views: 98,
    timestamp: "Yesterday",
  },
  {
    id: 4,
    title: "Strategies for winning the weekly competition",
    author: "OceanExplorer",
    category: "Competitions",
    replies: 15,
    views: 450,
    timestamp: "2 days ago",
  },
  {
    id: 5,
    title: "Official: New fish species coming next month!",
    author: "AquaAdmin",
    category: "Announcements",
    replies: 20,
    views: 1000,
    timestamp: "3 days ago",
  },
];
  
export const mockEvents = [
  {
    id: 1,
    name: "Spring Aquarium Contest",
    description:
      "Celebrate spring! Showcase your best-themed aquarium with exclusive decorations and rare fish.",
    startDate: "Apr 20",
    endDate: "May 5, 2025",
    participants: 25,
    rewards: "Legendary Spring Fish Collection + 5,000 Coins",
    status: "active", // Ongoing event
  },
  {
    id: 2,
    name: "Deep Sea Expedition",
    description:
      "Join the expedition to explore the darkest depths of the ocean. Complete challenges to earn unique treasures.",
    startDate: "Apr 20",
    endDate: "May 5, 2025",
    participants: 12,
    rewards: "Exclusive Deep Sea Decorations",
    status: "upcoming", // Future event
  },
  {
    id: 3,
    name: "Breeding Bonanza Weekend",
    description:
      "Special weekend event focusing on breeding new fish species. Earn rare fish genes and boost your collection.",
    startDate: "Apr 20",
    endDate: "May 5, 2025",
    participants: 18,
    rewards: "Rare Fish Genes + 2,000 Coins",
    status: "upcoming", // Another future event
  },
  {
    id: 4,
    name: "Winter Wonderland Challenge",
    description:
      "Compete in this winter-themed aquarium contest for frosty decorations and exclusive fish. Event has ended.",
    startDate: "Apr 20",
    endDate: "May 5, 2025",
    participants: 30,
    rewards: "Snowflake Decorations + 1,500 Coins",
    status: "past", // Completed event
  },
];