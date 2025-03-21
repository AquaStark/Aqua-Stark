export const mockFishData = [
  {
    id: "1",
    name: "Fish 1",
    image: "/fish/fish1.png",
    position: { x: 20, y: 30 },
    nftMetadata: { rarity: "Common", generation: 1, traits: ["Fast", "Small"] }
  },
  {
    id: "2",
    name: "Fish 2",
    image: "/fish/fish2.png",
    position: { x: 50, y: 60 },
    nftMetadata: { rarity: "Rare", generation: 2, traits: ["Shiny", "Big"] }
  }
];

export const mockAquariumStats = {
  currentFish: mockFishData.length,
  maxFish: 10,
  cleanliness: 80,
  food: 60 
};

export const mockAquariums = [
  { id: "1", name: "My First Aquarium" },
  { id: "2", name: "Second Aquarium" },
  { id: "3", name: "Tropical Paradise", locked: true }
];

export const mockPlayerData = {
  playerLevel: 5,
  playerExperience: 50000,
  maxExperience: 100000,
  profileImage: "profile-mock.png"
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

  export const getStatusByLevel = (level: number): "sad"| "neutral" | "happy" => {
    if (level < 50) return "sad";
    else if (level < 75) return "neutral";
    else return "happy";
  };
  export const mockFeaturedFish = [
    {
      name: "REDGLOW",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish3-LOteAGqWGR4lDQ8VBBAlRSUByZL2KX.png",
      price: 1500,
    },
    {
      name: "BLUESHINE",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png",
      price: 2000,
    },
    {
      name: "TROPICORAL",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish2-D0YdqsjY0OgI0AZg98FS0Sq7zMm2Fe.png",
      price: 2500,
    },
  ]
  export const mockGameFeatures = [
    {
      title: "Collect Unique Fish",
      description: "Discover and collect over 100 species of fish with different rarities and special abilities.",
      icon: "🐠",
    },
    {
      title: "Customize Your Aquarium",
      description: "Decorate your aquarium with plants, rocks, castles, and many more objects to create the perfect habitat.",
      icon: "🏰",
    },
    {
      title: "Feed and Care for Your Fish",
      description: "Keep your fish happy and healthy with different types of food and special care.",
      icon: "🍽️",
    },
    {
      title: "Compete with Friends",
      description: "Show off your collection to your friends and compete to have the most impressive aquarium.",
      icon: "🏆",
    },
  ]
    

export default mockFishData;
