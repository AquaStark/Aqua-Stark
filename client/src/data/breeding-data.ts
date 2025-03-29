
// dataStore.ts

export const bubblesData = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 30 + 10,
    left: Math.random() * 100,
    animationDuration: Math.random() * 15 + 5,
  }));
  
  export const backgroundBubblesData = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 40,
    left: Math.random() * 100,
    duration: Math.random() * 25 + 15,
    delay: Math.random() * 10,
    drift: (Math.random() - 0.5) * 100,
  }));
  
  export const particlesData = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    floatX: (Math.random() - 0.5) * 200,
    floatY: (Math.random() - 0.5) * 200,
  }));
  
  export const discoveriesData = [
    {
      id: 1,
      date: "Discovered Apr 10, 2025",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png",
      name: "Azure Driffer",
      rarity: "Common",
      parents: "Royal Crowntail Ems\\arald Whisker",
      traits: "Gold, Metallic, Green, Medium",
    },
    {
      id: 2,
      date: "Discovered Apr 10, 2025",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish3-LOteAGqWGR4lDQ8VBBAlRSUByZL2KX.png",
      name: "Azure Driffer",
      rarity: "Epic",
      parents: "Royal Crowntail Ems\\arald Whisker",
      traits: "Gold, Metallic, Green, Medium",
    },
    {
      id: 3,
      date: "Discovered Apr 10, 2025",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png",
      name: "Azure Driffer",
      rarity: "Common",
      parents: "Royal Crowntail Ems\\arald Whisker",
      traits: "Gold, Metallic, Green, Medium",
    },
  ];
  
  export const undiscoveredSpeciesData = [
    {
      id: 1,
      name: "Undiscovered Species",
      rarity: "Unknown",
      hints: "Try breeding fishes with species trait",
    },
    {
      id: 2,
      name: "Undiscovered Species",
      rarity: "Unknown",
      hints: "Try breeding fishes with species trait",
    },
    {
      id: 3,
      name: "Undiscovered Species",
      rarity: "Unknown",
      hints: "Try breeding fishes with species trait",
    },
  ];