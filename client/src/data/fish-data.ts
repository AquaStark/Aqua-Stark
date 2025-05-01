import type { Fish, BreedingResult } from "@/types/fish";

// Sample fish data
export const fishCollection: Fish[] = [
  {
    id: 1,
    name: "Celestial Glowfin",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png",
    rarity: "Legendary",
    generation: 1,
    level: 8,
    traits: {
      color: "Blue",
      pattern: "Spotted",
      fins: "Long",
      size: "Medium",
      special: "Bioluminescent",
    },
  },
  {
    id: 2,
    name: "Royal Crowntail",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish2-D0YdqsjY0OgI0AZg98FS0Sq7zMm2Fe.png",
    rarity: "Rare",
    generation: 1,
    level: 12,
    traits: {
      color: "Orange",
      pattern: "Striped",
      fins: "Crown",
      size: "Large",
    },
    breedingCooldown: "Ready",
  },
  {
    id: 3,
    name: "Crimson Flasher",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish3-LOteAGqWGR4lDQ8VBBAlRSUByZL2KX.png",
    rarity: "Epic",
    generation: 1,
    level: 10,
    traits: {
      color: "Red",
      pattern: "Solid",
      fins: "Short",
      size: "Small",
      special: "Fast",
    },
  },
  {
    id: 4,
    name: "Azure Drifter",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png",
    rarity: "Common",
    generation: 2,
    level: 15,
    traits: {
      color: "Blue",
      pattern: "Gradient",
      fins: "Medium",
      size: "Medium",
    },
    parents: {
      father: 1,
      mother: 3,
    },
  },
  {
    id: 5,
    name: "Emerald Whisker",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish2-D0YdqsjY0OgI0AZg98FS0Sq7zMm2Fe.png",
    rarity: "Uncommon",
    generation: 1,
    level: 7,
    traits: {
      color: "Green",
      pattern: "Spotted",
      fins: "Whisker",
      size: "Small",
    },
  },
  {
    id: 6,
    name: "Golden Shimmer",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish3-LOteAGqWGR4lDQ8VBBAlRSUByZL2KX.png",
    rarity: "Epic",
    generation: 2,
    level: 9,
    traits: {
      color: "Gold",
      pattern: "Metallic",
      fins: "Long",
      size: "Medium",
      special: "Shimmering",
    },
    parents: {
      father: 2,
      mother: 5,
    },
  },
];

// Sample breeding results
export const breedingResults: BreedingResult[] = [
  {
    id: 4,
    name: "Azure Drifter",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png",
    rarity: "Common",
    traits: {
      color: "Blue",
      pattern: "Gradient",
      fins: "Medium",
      size: "Medium",
    },
    parents: {
      father: 1,
      mother: 3,
    },
    discovered: "Apr 10, 2025",
  },
  {
    id: 6,
    name: "Golden Shimmer",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish3-LOteAGqWGR4lDQ8VBBAlRSUByZL2KX.png",
    rarity: "Epic",
    traits: {
      color: "Gold",
      pattern: "Metallic",
      fins: "Long",
      size: "Medium",
      special: "Shimmering",
    },
    parents: {
      father: 2,
      mother: 5,
    },
    discovered: "Apr 15, 2025",
  },
  {
    id: 7,
    name: "Sapphire Whisker",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish2-D0YdqsjY0OgI0AZg98FS0Sq7zMm2Fe.png",
    rarity: "Rare",
    traits: {
      color: "Blue",
      pattern: "Spotted",
      fins: "Whisker",
      size: "Small",
    },
    parents: {
      father: 1,
      mother: 5,
    },
    discovered: "Apr 18, 2025",
  },
];
