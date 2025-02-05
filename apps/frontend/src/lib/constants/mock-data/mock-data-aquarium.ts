const mockFishData = [
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
  
  export const mockAquariums = [
    { id: "1", name: "My First Aquarium" },
    { id: "2", name: "Second Aquarium", locked: true },
    { id: "3", name: "Tropical Paradise", locked: true }
  ];  

  export default mockFishData;
  