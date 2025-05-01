import { useEncyclopedia } from "@/hooks/use-encyclopedia"
import CollectionProgress from "@/components/encyclopedia/collection-stats/collection-progress"
import BreakdownSection from "@/components/encyclopedia/collection-stats/breakdown-section"
import RecentDiscoveries from "@/components/encyclopedia/collection-stats/recent-discoveries"
import CollectionAchievements from "@/components/encyclopedia/collection-stats/collection-achievements"

export default function EncyclopediaStats() {
  const { totalSpecies, discoveredSpecies } = useEncyclopedia()

  const progressData = {
    discovered: discoveredSpecies,
    total: totalSpecies,
    percentage: totalSpecies > 0 ? Math.round((discoveredSpecies / totalSpecies) * 100) : 0,
  }

  const rarityData = [
    { name: "Common", current: 2, total: 2, color: "bg-amber-500" },
    { name: "Uncommon", current: 2, total: 2, color: "bg-green-500" },
    { name: "Rare", current: 1, total: 2, color: "bg-blue-500" },
    { name: "Epic", current: 3, total: 3, color: "bg-purple-500" },
    { name: "Legendary", current: 1, total: 3, color: "bg-orange-500" },
  ]

  const habitatData = [
    { name: "Freshwater", current: 4, total: 4, color: "bg-blue-400" },
    { name: "Saltwater", current: 1, total: 1, color: "bg-blue-500" },
    { name: "Brackish", current: 0, total: 1, color: "bg-blue-600" },
    { name: "Deep Sea", current: 1, total: 3, color: "bg-blue-700" },
    { name: "Tropical", current: 3, total: 3, color: "bg-orange-500" },
  ]

  const recentDiscoveries = [
    {
      id: 1,
      name: "Golden Shimmer",
      date: "19/3/2025",
      rarity: "Epic",
      image: "/public/fish/fish3.png",
    },
    {
      id: 2,
      name: "Celestial Glowfin",
      date: "14/3/2025",
      rarity: "Legendary",
      image: "/public/fish/fish4.png",
    },
    {
      id: 3,
      name: "Rainbow Scales",
      date: "9/3/2025",
      rarity: "Epic",
      image: "/public/fish/fish3.png",
    },
    {
      id: 4,
      name: "Crimson Flasher",
      date: "4/3/2025",
      rarity: "Epic",
      image: "/public/fish/fish3.png",
    },
    {
      id: 5,
      name: "Royal Crowntail",
      date: "19/2/2025",
      rarity: "Rare",
      image: "/public/fish/fish1.png",
    },
  ]

  // Example achievements data
  const achievements = [
    {
      id: 1,
      title: "Beginner Collector",
      description: "Discover 5 different fish species",
      current: 5,
      total: 5,
      completed: true,
    },
    {
      id: 2,
      title: "Intermediate Collector",
      description: "Discover 10 different fish species",
      current: discoveredSpecies,
      total: 10,
      completed: discoveredSpecies >= 10,
    },
    {
      id: 3,
      title: "Rare Finder",
      description: "Discover 2 rare fish species",
      current: 1,
      total: 2,
      completed: false,
    },
    {
      id: 4,
      title: "Legendary Discovery",
      description: "Discover 1 legendary fish species",
      current: 1,
      total: 1,
      completed: true,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-blue-800/80 p-6 shadow-lg backdrop-blur-sm border border-blue-700/50">
        <CollectionProgress data={progressData} />

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <BreakdownSection title="Rarity Breakdown" items={rarityData} />
          <BreakdownSection title="Habitat Breakdown" items={habitatData} />
        </div>
      </div>

      <div className="rounded-xl bg-blue-800/80 p-6 shadow-lg backdrop-blur-sm border border-blue-700/50">
        <RecentDiscoveries discoveries={recentDiscoveries} />
      </div>

      <div className="rounded-xl bg-blue-800/80 p-6 shadow-lg backdrop-blur-sm border border-blue-700/50">
        <CollectionAchievements achievements={achievements} />
      </div>
    </div>
  )
}
