export const mockAquariums = [
  {
    id: 1,
    name: 'Tropical Paradise',
    owner: 'CoralQueen',
    timePosted: '3 days ago',
    timeStamp: '2025-04-24T12:00:00Z',
    likes: 120,
    comments: 45,
    featured: true,
    imageUrl: '/textures/backgrounds/bg2.png',
  },
  {
    id: 2,
    name: 'Deep Blue Mystery',
    owner: 'ReefMaster',
    likes: 89,
    comments: 12,
    imageUrl: '/textures/backgrounds/bg3.png',
  },
  {
    id: 3,
    name: 'Neon Reef Collection',
    owner: 'AquaLover',
    likes: 50,
    comments: 8,
    imageUrl: '/textures/backgrounds/bg4.png',
    timeStamp: '2025-04-22T12:00:00Z',
  },
  {
    id: 4,
    name: 'Ancient Sunken Aquarium',
    owner: 'TreasureHunter',
    likes: 78,
    comments: 14,
    imageUrl: '/textures/backgrounds/bg5.png',
    timeStamp: '2025-04-20T12:00:00Z',
  },
  // ... más acuarios
];

export const mockFriends = [
  {
    username: 'CoralQueen',
    level: 20,
    isOnline: true,
    imageUrl: '/textures/avatars/1.jpg',
  },
  {
    username: 'FishMaster99',
    level: 15,
    isOnline: false,
    imageUrl: '/textures/avatars/4.png',
  },
  {
    username: 'OceanExplorer',
    level: 12,
    isOnline: true,
    imageUrl: '/textures/avatars/2.jpg',
  },
  {
    username: 'AquaDesigner',
    level: 18,
    isOnline: false,
    imageUrl: '/textures/avatars/3.jpg',
  },
];

export const mockSuggestions = [
  {
    username: 'AquaFriend2',
    level: 7,
    isOnline: true,
    imageUrl: '/textures/avatars/5.jpg',
  },
  {
    username: 'AquaFriend3',
    level: 9,
    isOnline: false,
    imageUrl: '/textures/avatars/5.jpg',
  },
];

export const popularCategories = [
  'Breeding',
  'Decorations',
  'Maintenance',
  'Competitions',
  'Tips & Tricks',
  'Off-Topic',
];

export const recentDiscussions = [
  {
    id: 1,
    title: 'Best breeding combinations for rare fish',
    author: 'FishMaster99',
    category: 'Breeding',
    replies: 12,
    views: 345,
    timestamp: '3 hours ago',
    imageUrl: '/textures/avatars/4.png',
  },
  {
    id: 2,
    title: 'How to maintain perfect water quality?',
    author: 'CoralQueen',
    category: 'Maintenance',
    replies: 8,
    views: 210,
    timestamp: '5 hours ago',
    imageUrl: '/textures/avatars/1.jpg',
  },
  {
    id: 3,
    title: 'Decoration ideas for small aquariums',
    author: 'AquaLover',
    category: 'Decorations',
    replies: 5,
    views: 98,
    timestamp: 'Yesterday',
    imageUrl: '/textures/avatars/5.jpg',
  },
  {
    id: 4,
    title: 'Strategies for winning the weekly competition',
    author: 'OceanExplorer',
    category: 'Competitions',
    replies: 15,
    views: 450,
    timestamp: '2 days ago',
    imageUrl: '/textures/avatars/2.jpg',
  },
  {
    id: 5,
    title: 'Official: New fish species coming next month!',
    author: 'AquaAdmin',
    category: 'Announcements',
    replies: 20,
    views: 1000,
    timestamp: '3 days ago',
    imageUrl: '/textures/avatars/5.jpg',
  },
];

export const mockEvents = [
  {
    id: 1,
    name: 'Spring Aquarium Contest',
    description:
      'Celebrate spring! Showcase your best-themed aquarium with exclusive decorations and rare fish.',
    startDate: 'Apr 20, 2025',
    endDate: 'May 5, 2025',
    participants: 25,
    rewards: 'Legendary Spring Fish Collection + 5,000 Coins',
    imageUrl: '/textures/events/spring-aquarium.jpg',
    status: 'active', // Ongoing event
  },
  {
    id: 2,
    name: 'Deep Sea Expedition',
    description:
      'Join the expedition to explore the darkest depths of the ocean. Complete challenges to earn unique treasures.',
    startDate: 'Jun 20, 2025',
    endDate: 'Jul 5, 2025',
    participants: 12,
    rewards: 'Exclusive Deep Sea Decorations',
    imageUrl: '/textures/events/deep-sea-expedition.jpg',
    status: 'upcoming', // Future event
  },
  {
    id: 3,
    name: 'Breeding Bonanza Weekend',
    description:
      'Special weekend event focusing on breeding new fish species. Earn rare fish genes and boost your collection.',
    startDate: 'Aug 20, 2025',
    endDate: 'Sept 5, 2025',
    participants: 18,
    rewards: 'Rare Fish Genes + 2,000 Coins',
    imageUrl: '/textures/events/breeding-bonanza.jpg',
    status: 'upcoming', // Another future event
  },
  {
    id: 4,
    name: 'Winter Wonderland Challenge',
    description:
      'Compete in this winter-themed aquarium contest for frosty decorations and exclusive fish. Event has ended.',
    startDate: 'Feb 20, 2025',
    endDate: 'Mar 5, 2025',
    participants: 30,
    rewards: 'Snowflake Decorations + 1,500 Coins',
    imageUrl: '/textures/events/winter-wonderland.jpg',
    status: 'past', // Completed event
  },
];
