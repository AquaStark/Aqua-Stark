export const mockFishData = [
  {
    id: "1",
    name: "Fish 1",
    image: "/fish/fish1.png",
    position: { x: 20, y: 30 },
    nftMetadata: { rarity: "Common", generation: 1, traits: ["Fast", "Small"] },
  },
  {
    id: "2",
    name: "Fish 2",
    image: "/fish/fish2.png",
    position: { x: 50, y: 60 },
    nftMetadata: { rarity: "Rare", generation: 2, traits: ["Shiny", "Big"] },
  },
];

export const mockAquariumStats = {
  currentFish: mockFishData.length,
  maxFish: 10,
  cleanliness: 80,
  food: 60,
};

export const mockAquariums = [
  { id: "1", name: "My First Aquarium" },
  { id: "2", name: "Second Aquarium" },
  { id: "3", name: "Tropical Paradise", locked: true },
];

export const mockPlayerData = {
  playerLevel: 5,
  playerExperience: 50000,
  maxExperience: 100000,
  profileImage: "profile-mock.png",
};

export const fishStatusBarColors = {
  sad: "bg-red-500",
  neutral: "bg-yellow-500",
  happy: "bg-green-500",
};

export const fishStatusBarIconPaths = {
  sad: "/textures/icons/EmojiFrown.svg",
  neutral: "/textures/icons/EmojiSerious.svg",
  happy: "/textures/icons/EmojiSmile.svg",
};

export const getStatusByLevel = (
  level: number
): "sad" | "neutral" | "happy" => {
  if (level < 50) return "sad";
  else if (level < 75) return "neutral";
  else return "happy";
};

export const mockLoginRewards = [
  {
    id: 1,
    day: 1,
    qty: 100,
    type: "coins",
    collected: true,
    special: false,
    current_day: false,
  },
  {
    id: 2,
    day: 2,
    qty: 3,
    type: "food",
    collected: true,
    special: false,
    current_day: false,
  },
  {
    id: 3,
    day: 3,
    qty: 1,
    type: "xp_boost",
    collected: true,
    special: false,
    current_day: false,
  },
  {
    id: 4,
    day: 4,
    qty: 200,
    type: "coins",
    collected: true,
    special: false,
    current_day: false,
  },
  {
    id: 5,
    day: 5,
    qty: 1,
    type: "decoration",
    collected: false,
    special: false,
    current_day: true,
  },
  {
    id: 6,
    day: 6,
    qty: 300,
    type: "coins",
    collected: false,
    special: false,
    current_day: false,
  },
  {
    id: 7,
    day: 7,
    qty: 100,
    type: "rare_fish_egg",
    collected: false,
    current_day: false,
    special: true,
  },
  {
    id: 8,
    day: 8,
    qty: 150,
    type: "coins",
    collected: false,
    special: false,
    current_day: false,
  },
  {
    id: 9,
    day: 9,
    qty: 5,
    type: "food",
    collected: false,
    special: false,
    current_day: false,
  },
  {
    id: 10,
    day: 10,
    qty: 100,
    type: "xp_boost",
    collected: false,
    special: false,
    current_day: false,
  },
  {
    id: 11,
    day: 11,
    qty: 350,
    type: "coins",
    collected: false,
    special: false,
    current_day: false,
  },
  {
    id: 12,
    day: 12,
    qty: 1,
    type: "decoration",
    collected: false,
    special: false,
    current_day: false,
  },
  {
    id: 13,
    day: 13,
    qty: 400,
    type: "coins",
    collected: false,
    special: false,
    current_day: false,
  },
  {
    id: 14,
    day: 14,
    qty: 1,
    type: "legendary_fish",
    collected: false,
    current_day: false,
    special: true,
  },
];

export const mockGameMilestones = [
  {
    id: 1,
    title: "Reach Level 10",
    description: "Achieve player level 10",
    reward: "1,000 Coins + Premium Tank Expansion",
    completed: true,
    claimed: true,
    type: "achievement",
    progress: 10,
    total: 10,
  },
  {
    id: 2,
    title: "Fish Collection: 20",
    description: "Collect 20 different fish species",
    reward: "Rare Fish Egg + 500 Coins",
    completed: true,
    claimed: true,
    type: "collection",
    progress: 20,
    total: 20,
  },
  {
    id: 3,
    title: "Fish Collection: 50",
    description: "Collect 40 different fish species",
    reward: "Legendary Fish Egg + 2,000 Coins",
    completed: false,
    claimed: false,
    type: "collection",
    progress: 24,
    total: 50,
  },
  {
    id: 4,
    title: "Master Breeder",
    description: "Successfully breed 10 different fish combinations",
    reward: "Breeding Labouratory + 2,000 Coins",
    completed: false,
    claimed: false,
    type: "collection",
    progress: 7,
    total: 10,
  },
  {
    id: 5,
    title: "Reach Level 25",
    description: "Achieve player level 25",
    reward: "3,000 Coins + Exclusive Decoration Set",
    completed: false,
    claimed: false,
    type: "achievement",
    progress: 12,
    total: 25,
  },
  {
    id: 6,
    title: "Social Butterfly",
    description: "Make 20 friends in the community",
    reward: "Social Profile Frame + Special Title",
    completed: false,
    claimed: false,
    type: "community",
    progress: 4,
    total: 20,
  },
];

export default mockFishData;

