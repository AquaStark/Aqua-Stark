export interface Fish {
  id: string;
  name: string;
  scientificName: string;
  image?: string;
  unlocked: boolean;
  rarity?: "common" | "rare" | "new";
  tags: string[];
  description?: string;
  habitat?: string;
  diet?: string;
  temperament?: string;
  size?: string;
  lifespan?: string;
  careLevel?: string;
  waterParameters?: {
    temperature: {
      min: number;
      max: number;
    };
    pH: {
      min: number;
      max: number;
    };
  };
  specialTraits?: string[];
  compatibleWith?: string[];
  incompatibleWith?: string[];
}

export const fishData: Fish[] = [
  {
    id: "unknown1",
    name: "Unknown Species",
    scientificName: "",
    unlocked: false,
    tags: [],
  },
  {
    id: "azure-drifter",
    name: "Azure Drifter",
    scientificName: "Caeruleus vagans",
    image: "/placeholder.svg?height=128&width=128",
    unlocked: true,
    rarity: "common",
    tags: ["Freshwater", "Omnivore", "Peaceful"],
    description:
      "The Azure Drifter is a common but beloved species known for its calming presence and gentle swimming pattern. These fish are ideal for beginners due to their hardiness and adaptability. They feature a gradient of blue hues that seem to shimmer as they move through the water.",
    habitat: "Freshwater",
    diet: "Omnivore",
    temperament: "Peaceful",
    size: "Small",
    lifespan: "3-5 years",
    careLevel: "Easy",
    waterParameters: {
      temperature: {
        min: 72,
        max: 80,
      },
      pH: {
        min: 6.5,
        max: 7.5,
      },
    },
    specialTraits: ["Hardy", "Beginner-Friendly"],
    compatibleWith: ["Bubble Floater", "Coral Nibbler", "Gentle Glider"],
    incompatibleWith: ["Crimson Betta", "Feisty Barracuda"],
  },
  {
    id: "bubble-floater",
    name: "Bubble Floater",
    scientificName: "Bulla natans",
    image: "/placeholder.svg?height=128&width=128",
    unlocked: true,
    rarity: "common",
    tags: ["Freshwater", "Omnivore", "Peaceful"],
    description:
      "The Bubble Floater is known for its unique ability to create small bubbles that help it float near the water surface. Its translucent body with blue-green hues makes it a visually appealing addition to any aquarium.",
    habitat: "Freshwater",
    diet: "Omnivore",
    temperament: "Peaceful",
    size: "Small",
    lifespan: "2-4 years",
    careLevel: "Easy",
    waterParameters: {
      temperature: {
        min: 70,
        max: 78,
      },
      pH: {
        min: 6.0,
        max: 7.2,
      },
    },
    specialTraits: ["Bubble Nesting", "Surface Dwelling"],
    compatibleWith: ["Azure Drifter", "Coral Nibbler", "Gentle Glider"],
    incompatibleWith: ["Crimson Betta", "Feisty Barracuda"],
  },
  {
    id: "celestial-glowfin",
    name: "Celestial Glowfin",
    scientificName: "Luminaris caelestis",
    image: "/placeholder.svg?height=128&width=128",
    unlocked: true,
    rarity: "new",
    tags: ["Deep Sea", "Omnivore", "Peaceful"],
    description:
      "The Celestial Glowfin is a remarkable deep-sea species that produces its own bioluminescent light. In dark aquariums, they create a stunning starry night effect that captivates viewers.",
    habitat: "Deep Sea",
    diet: "Omnivore",
    temperament: "Peaceful",
    size: "Medium",
    lifespan: "4-6 years",
    careLevel: "Moderate",
    waterParameters: {
      temperature: {
        min: 65,
        max: 72,
      },
      pH: {
        min: 7.0,
        max: 8.0,
      },
    },
    specialTraits: ["Bioluminescent", "Nocturnal"],
    compatibleWith: ["Azure Drifter", "Gentle Glider"],
    incompatibleWith: ["Bubble Floater", "Coral Nibbler"],
  },
  {
    id: "coral-nibbler",
    name: "Coral Nibbler",
    scientificName: "Corallium rodens",
    image: "/placeholder.svg?height=128&width=128",
    unlocked: true,
    rarity: "common",
    tags: ["Saltwater", "Herbivore", "Peaceful"],
    description:
      "The Coral Nibbler is a saltwater species that gets its name from its tendency to graze on algae growing on coral reefs. Their bright colors and active behavior make them popular in reef tanks.",
    habitat: "Saltwater",
    diet: "Herbivore",
    temperament: "Peaceful",
    size: "Small",
    lifespan: "3-5 years",
    careLevel: "Moderate",
    waterParameters: {
      temperature: {
        min: 75,
        max: 82,
      },
      pH: {
        min: 8.1,
        max: 8.4,
      },
    },
    specialTraits: ["Reef Safe", "Algae Control"],
    compatibleWith: ["Azure Drifter", "Bubble Floater"],
    incompatibleWith: ["Celestial Glowfin", "Crimson Flasher"],
  },
  {
    id: "crimson-flasher",
    name: "Crimson Flasher",
    scientificName: "Rubrum fulgurans",
    image: "/placeholder.svg?height=128&width=128",
    unlocked: true,
    rarity: "rare",
    tags: ["Freshwater", "Carnivore", "Peaceful"],
    description:
      "The Crimson Flasher is known for its brilliant red coloration that seems to flash or intensify when the fish is excited. They are active swimmers that add vibrant color to any aquarium.",
    habitat: "Freshwater",
    diet: "Carnivore",
    temperament: "Peaceful",
    size: "Medium",
    lifespan: "5-7 years",
    careLevel: "Moderate",
    waterParameters: {
      temperature: {
        min: 74,
        max: 82,
      },
      pH: {
        min: 6.8,
        max: 7.8,
      },
    },
    specialTraits: ["Vibrant Coloration", "Active Swimmer"],
    compatibleWith: ["Azure Drifter", "Bubble Floater"],
    incompatibleWith: ["Coral Nibbler", "Celestial Glowfin"],
  },
  {
    id: "gentle-glider",
    name: "Gentle Glider",
    scientificName: "Placidus volans",
    image: "/placeholder.svg?height=128&width=128",
    unlocked: true,
    rarity: "common",
    tags: ["Freshwater", "Herbivore", "Peaceful"],
    description:
      "The Gentle Glider is known for its graceful swimming style, appearing to glide through the water with minimal effort. Their peaceful nature makes them excellent community fish.",
    habitat: "Freshwater",
    diet: "Herbivore",
    temperament: "Peaceful",
    size: "Small",
    lifespan: "3-6 years",
    careLevel: "Easy",
    waterParameters: {
      temperature: {
        min: 70,
        max: 78,
      },
      pH: {
        min: 6.5,
        max: 7.5,
      },
    },
    specialTraits: ["Graceful Swimming", "Schooling"],
    compatibleWith: ["Azure Drifter", "Bubble Floater", "Celestial Glowfin"],
    incompatibleWith: ["Crimson Betta", "Feisty Barracuda"],
  },
  {
    id: "crimson-betta",
    name: "Crimson Betta",
    scientificName: "Pugnax rubrum",
    image: "/placeholder.svg?height=128&width=128",
    unlocked: true,
    rarity: "rare",
    tags: ["Freshwater", "Carnivore", "Aggressive"],
    description:
      "The Crimson Betta is known for its striking red coloration and flowing fins. While beautiful, they are territorial and should be kept with care.",
    habitat: "Freshwater",
    diet: "Carnivore",
    temperament: "Aggressive",
    size: "Small",
    lifespan: "2-4 years",
    careLevel: "Moderate",
    waterParameters: {
      temperature: {
        min: 76,
        max: 82,
      },
      pH: {
        min: 6.5,
        max: 7.0,
      },
    },
    specialTraits: ["Territorial", "Bubble Nest Builder"],
    compatibleWith: ["Feisty Barracuda"],
    incompatibleWith: ["Azure Drifter", "Bubble Floater", "Gentle Glider"],
  },
  {
    id: "feisty-barracuda",
    name: "Feisty Barracuda",
    scientificName: "Sphyraena minimus",
    image: "/placeholder.svg?height=128&width=128",
    unlocked: true,
    rarity: "rare",
    tags: ["Saltwater", "Carnivore", "Aggressive"],
    description:
      "The Feisty Barracuda is a miniature version of its larger relatives, but still maintains a predatory nature. They require specific care and tank mates.",
    habitat: "Saltwater",
    diet: "Carnivore",
    temperament: "Aggressive",
    size: "Medium",
    lifespan: "5-8 years",
    careLevel: "Advanced",
    waterParameters: {
      temperature: {
        min: 75,
        max: 82,
      },
      pH: {
        min: 8.1,
        max: 8.4,
      },
    },
    specialTraits: ["Predatory", "Fast Swimmer"],
    compatibleWith: ["Crimson Betta"],
    incompatibleWith: ["Azure Drifter", "Bubble Floater", "Gentle Glider"],
  },
];
