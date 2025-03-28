import type { Category, FeaturedTopic } from "@/types/help-types";

export const categories: Category[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    topics: [
      {
        id: "game-basics",
        title: "Game Basics",
        description: "Learn the fundamentals of Aqua Stark",
        icon: "info",
        sections: [
          {
            type: "paragraph",
            content:
              "Aqua Stark is an exciting aquarium simulation game where you can collect, breed, and care for a variety of unique fish species. Your goal is to create the most beautiful and thriving aquarium while completing challenges and unlocking new content.",
          },
          {
            type: "list",
            content: "Quick Start Guide:",
            items: [
              "Start by setting up your first aquarium",
              "Purchase your first fish from the store",
              "Feed your fish regularly to keep them healthy",
              "Decorate your aquarium to increase happiness",
              "Complete daily tasks to earn coins",
            ],
          },
          {
            type: "divider",
            content: "Your aquarium is your canvas - make it unique!",
          },
          {
            type: "paragraph",
            content:
              "The game interface is designed to be intuitive and fun. The top bar shows your fish count and status bars, while the side menus give you access to decorations and special items.",
          },
        ],
      },
      {
        id: "game-controls",
        title: "Game Controls",
        description: "How to navigate and interact with the game",
        icon: "gamepad",
        sections: [],
      },
      {
        id: "your-first-aquarium",
        title: "Your First Aquarium",
        description: "Setting up your first underwater world",
        icon: "waves",
        sections: [],
      },
    ],
  },
  {
    id: "fish-care",
    name: "Fish Care",
    topics: [
      {
        id: "feeding-your-fish",
        title: "Feeding Your Fish",
        description: "Learn about proper fish nutrition",
        icon: "droplets",
        sections: [
          {
            type: "paragraph",
            content:
              "Proper feeding is essential for keeping your fish healthy and happy in Aqua Stark. Different species have different dietary needs and feeding schedules.",
          },
          {
            type: "list",
            content: "Basic Feeding Guidelines:",
            items: [
              "Feed most fish 1-2 times daily",
              "Only feed what your fish can consume in 2-3 minutes",
              "Overfeeding can pollute the water and harm your fish",
              "Different species may require specialized food",
            ],
          },
          {
            type: "heading",
            level: 3,
            content: "Food Types:",
          },
          {
            type: "grid",
            content: "Food Types:",
            columns: 2,
            gridItems: [
              {
                title: "Basic Flakes",
                description:
                  "Standard food suitable for most fish. Provides basic nutrition and is affordable.",
                icon: "utensils",
                bgColor: "bg-yellow-500 opacity-80 text-white",
              },
              {
                title: "Algae Wafers",
                description:
                  "Perfect for herbivorous fish. Sinks to the bottom for bottom-feeders.",
                icon: "leaf",
                bgColor: "bg-green-500 opacity-80 text-white",
              },
              {
                title: "Premium Pellets",
                description:
                  "High-protein food for carnivorous fish. Enhances color and growth.",
                icon: "shrimp",
                bgColor: "bg-red-500 opacity-80 text-white",
              },
              {
                title: "Special Treats",
                description:
                  "Boosts happiness and can trigger special behaviors or breeding.",
                icon: "sparkles",
                bgColor: "bg-purple-500 opacity-80 text-yellow-400",
              },
            ],
          },
          {
            type: "center",
            content: "Feeding Time!",
          },
          {
            type: "tip",
            iconType: "info",
            content:
              "Watch your fish's behavior during feeding. If they're not eating eagerly, they might be overfed or unwell. Adjust your feeding schedule accordingly.",
          },
        ],
      },
      {
        id: "fish-health",
        title: "Fish Health",
        description: "Keeping your aquatic friends healthy",
        icon: "heart",
        sections: [],
      },
      {
        id: "water-quality",
        title: "Water Quality",
        description: "Maintaining optimal water conditions",
        icon: "waves",
        sections: [],
      },
    ],
  },
  {
    id: "advanced-techniques",
    name: "Advanced Techniques",
    topics: [],
  },
];

export const featuredTopics: FeaturedTopic[] = [
  {
    id: "game-basics",
    categoryId: "getting-started",
    title: "Game Basics",
    description: "Learn the fundamentals of Aqua Stark",
    icon: "info",
    bgColor: "bg-blue-500 hover:bg-blue-600",
  },
  {
    id: "feeding-your-fish",
    categoryId: "fish-care",
    title: "Feeding Your Fish",
    description: "Learn about proper fish nutrition",
    icon: "heart",
    bgColor: "bg-green-700 hover:bg-green-800",
  },
  {
    id: "breeding-fish",
    categoryId: "advanced-techniques",
    title: "Breeding Fish",
    description: "Create new generations of rare fish",
    icon: "fish",
    bgColor: "bg-purple-700 hover:bg-purple-800",
  },
];
