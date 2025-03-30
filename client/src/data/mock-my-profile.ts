export interface FishItem {
    id: string
    name: string
    rarity: "Legendary" | "Rare" | "Special" | "Common"
    level: number
    obtainedDate: string
    imageUrl: string
  }
  
  export interface PlayerStats {
    fishFed: number
    decorationsPlaced: number
    fishBred: number
    aquariumsCreated: number
  }
  
  export interface ProfileData {
    username: string
    level: number
    joinDate: string
    experience: {
      current: number
      total: number
    }
    currency: number
    stats: {
      playTime: string
      fishCollected: number
      totalFish: number
      specialFish: number
      achievements: {
        completed: number
        total: number
      }
    }
    fishCollection: {
      collected: number
      total: number
      displayedFish: FishItem[]
    }
    playerStats: PlayerStats
  }
  
  const mockProfileData: ProfileData = {
    username: "salazarsebas",
    level: 12,
    joinDate: "February 15, 2025",
    experience: {
      current: 3450,
      total: 5000,
    },
    currency: 12500,
    stats: {
      playTime: "127h 45m",
      fishCollected: 24,
      totalFish: 100,
      specialFish: 5,
      achievements: {
        completed: 2,
        total: 8,
      },
    },
    fishCollection: {
      collected: 24,
      total: 100,
      displayedFish: [
        {
          id: "fish-001",
          name: "Celestial Glowfin",
          rarity: "Legendary",
          level: 8,
          obtainedDate: "Apr 5, 2025",
          imageUrl: "/fish/fish1.png",
        },
        {
          id: "fish-002",
          name: "Royal Crowntail",
          rarity: "Rare",
          level: 12,
          obtainedDate: "Mar 22, 2025",
          imageUrl: "/fish/fish2.png",
        },
        {
          id: "fish-003",
          name: "Crimson Flasher",
          rarity: "Special",
          level: 10,
          obtainedDate: "Apr 1, 2025",
          imageUrl: "/fish/fish3.png",
        },
        {
          id: "fish-004",
          name: "Azure Drifter",
          rarity: "Common",
          level: 15,
          obtainedDate: "Feb 18, 2025",
          imageUrl: "/fish/fish4.png",
        },
      ],
    },
    playerStats: {
      fishFed: 1248,
      decorationsPlaced: 87,
      fishBred: 36,
      aquariumsCreated: 5,
    },
  }
  
  export default mockProfileData  

  