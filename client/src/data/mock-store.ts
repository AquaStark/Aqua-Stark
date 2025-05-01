export const banners = [
  {
    title: "✨ BUY 2 GET 1 FREE",
    description: "Special offer on all decorations. Limited time only!",
    buttonText: "View Decorations",
    countdown: "23:56:39",
    bannerImage: "/fish/fish2.png",
    bannerVideo: "",
    background: "linear-gradient(to right, #079a57, #067B6D)",
  },
  {
    title: "✨ LEGENDARY FISH COLLECTION",
    description: "Get 30% off on all legendary fish this weekend only!",
    buttonText: "Shop Now",
    countdown: "23:56:36",
    bannerImage: "/fish/fish1.png",
    bannerVideo: "",
    background: "linear-gradient(to right, #3167ec,#5757e5, #9144db)",
  },
  {
    title: "✨ NEW ARRIVALS",
    description: "Discover our latest exotic fish species from the deep sea",
    buttonText: "Explore",
    countdown: "23:56:40",
    bannerVideo: "",
    bannerImage: "/fish/fish3.png",
    background: "linear-gradient(to right, #f7a038, #f55627)",
  },
];

// Misc items for the Others tab
export const miscItems = [
  {
    id: "basic-filter-001",
    name: "Basic Filter",
    image: "/items/basic-filter.png",
    price: 750,
    originalPrice: 850,
    rarity: "Common",
    category: "Equipment",
    description: "Entry-level water filtration for small aquariums",
    rating: 4.2,
    isNew: false,
    stock: 125,
    isLimited: false
  },
  {
    id: "advanced-filter-002",
    name: "Advanced Filter",
    image: "/items/advanced-filter.png",
    price: 1500,
    originalPrice: 1700,
    rarity: "Rare",
    category: "Equipment",
    description: "High-performance filtration system for larger tanks",
    rating: 4.8,
    isNew: false,
    stock: 50,
    isLimited: false
  },
  {
    id: "basic-food-003",
    name: "Basic Food",
    image: "/items/basic-food.png",
    price: 250,
    rarity: "Common",
    category: "Supplies",
    description: "Standard nutrition for common fish species",
    rating: 3.9,
    isNew: false,
    stock: 200,
    isLimited: false
  },
  {
    id: "premium-food-004",
    name: "Premium Food",
    image: "/items/premium-food.png",
    price: 500,
    originalPrice: 600,
    rarity: "Uncommon",
    category: "Supplies",
    description: "Enhanced formula for better fish health and colors",
    rating: 4.5,
    isNew: true,
    stock: 75,
    isLimited: false
  },
  {
    id: "basic-plant-005",
    name: "Basic Plant",
    image: "/items/basic-plant.png",
    price: 350,
    rarity: "Common",
    category: "Decoration",
    description: "Simple plant decoration for your aquarium",
    rating: 4.0,
    isNew: false,
    stock: 150,
    isLimited: false
  },
  {
    id: "mystery-chest-006",
    name: "Mystery Chest",
    image: "/items/chest.png",
    price: 800,
    originalPrice: 1000,
    rarity: "Special",
    category: "Special",
    description: "Contains random items and potential rare finds",
    rating: 4.7,
    isNew: true,
    stock: 20,
    isLimited: true
  },  
];

// Special bundles for the Others tab
export const bundles = [
  {
    id: "filtration-pack",
    name: "FILTRATION PACK",
    image: "/items/basic-filter.png",
    price: 3000,
    originalPrice: 3700,
    discount: "19% SAVINGS",
    tag: "Special",
    rarity: "Special",
    items: [
      "BASIC FILTER",
      "ADVANCED FILTER",
      "EXPANSION KIT"
    ],
    description: "Complete filtration solution for your aquarium"
  },
  {
    id: "premium-equipment",
    name: "PREMIUM EQUIPMENT",
    image: "/items/premium-filter.png",
    price: 6500,
    originalPrice: 8200,
    discount: "21% SAVINGS",
    tag: "Special",
    rarity: "Special",
    items: [
      "ADVANCED FILTER",
      "EXPANSION KIT",
      "PREMIUM FILTER"
    ],
    description: "High-end equipment package for serious aquarium enthusiasts"
  },
  {
    id: "starter-bundle",
    name: "Starter Kit Bundle",
    image: "/items/starter-kit.png",
    price: 1500,
    originalPrice: 2000,
    discount: "25% OFF",
    tag: "Best Value",
    rarity: "Special",
    items: [
      "Basic Filter",
      "Basic Food (x3)",
      "Basic Plant (x2)"
    ],
    description: "Everything you need to start your first aquarium. Perfect for beginners."
  },
  {
    id: "premium-bundle",
    name: "Premium Aquarium Bundle",
    image: "/items/aquarium.png",
    price: 3500,
    originalPrice: 4200,
    discount: "17% OFF",
    tag: "Exclusive",
    rarity: "Legendary",
    items: [
      "Advanced Filter",
      "Premium Food (x5)",
      "Mystery Chest",
      "Basic Plant (x3)"
    ],
    description: "High-end aquarium setup with premium equipment and exclusive items."
  },
  {
    id: "ancient-bundle",
    name: "Ancient Ruins Collection",
    image: "/items/ruin.png",
    price: 2800,
    originalPrice: 3500,
    discount: "20% OFF",
    tag: "Limited Edition",
    rarity: "Rare",
    items: [
      "Ancient Temple Ruins",
      "Mystery Chest (x2)",
      "Basic Filter"
    ],
    description: "Transform your aquarium into an ancient underwater civilization with these exclusive decorations."
  }
];
