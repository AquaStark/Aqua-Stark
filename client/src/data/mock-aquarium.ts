export const initialAquariums = [
    {
      id: 1,
      name: "My First Aquarium",
      image: "/items/aquarium.png",
      level: 5,
      type: "Tropical",
      health: 85,
      lastVisited: "2 hours ago",
      fishCount: "2/10",
      rating: 3,
      fishes: [
        {
          id: 1,
          name: "Blue Striped Fish",
          image: "/fish/fish1.png",
          rarity: "Rare",
          generation: 1,
          level: 2,
          traits: { color: "blue", pattern: "striped", fins: "long", size: "medium" }
        },
        {
          id: 2,
          name: "Tropical Coral Fish",
          image: "/fish/fish2.png",
          rarity: "Uncommon",
          generation: 2,
          level: 1,
          traits: { color: "orange", pattern: "spotted", fins: "short", size: "small" }
        }
      ]
    },
    {
      id: 2,
      name: "Second Aquarium",
      image: "/items/aquarium.png",
      level: 3,
      type: "Freshwater",
      health: 72,
      lastVisited: "1 day ago",
      fishCount: "4/8",
      rating: 2,
      fishes: []
    },
    {
      id: 3,
      name: "Tropical Paradise",
      image: "/items/aquarium.png",
      level: 8,
      type: "Coral Reef",
      health: 92,
      lastVisited: "3 hours ago",
      fishCount: "7/15",
      rating: 4,
      isPremium: true,
      fishes: []
    },
  ];