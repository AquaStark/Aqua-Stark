import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Book, Droplet, BarChart3 } from "lucide-react"
import { useEncyclopedia } from "@/hooks/use-encyclopedia"
import EncyclopediaCatalog from "@/components/encyclopedia/encyclopedia-catalog"
import EncyclopediaHabitats from "@/components/encyclopedia/encyclopedia-habitats"
import EncyclopediaStats from "@/components/encyclopedia/encyclopedia-stats"

export default function EncyclopediaTabs() {
  const encyclopediaState = useEncyclopedia()

  return (
    <>
      <TabsList className="grid grid-cols-3 mb-8 bg-blue-800/40 border border-blue-700/50 backdrop-blur-md rounded-xl overflow-hidden shadow-lg shadow-blue-900/20">
        <TabsTrigger
          value="catalog"
          className="relative py-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-md text-blue-200 transition-all duration-300 hover:bg-blue-600/60 hover:text-white group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 opacity-0 data-[state=active]:opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
          <Book className="h-5 w-5 mr-2 md:mr-2 transition-transform group-hover:scale-110 duration-300" />
          <span className="hidden md:inline font-medium">Fish Catalog</span>
        </TabsTrigger>
        <TabsTrigger
          value="habitats"
          className="relative py-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-md text-blue-200 transition-all duration-300 hover:bg-blue-600/60 hover:text-white group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 opacity-0 data-[state=active]:opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
          <Droplet className="h-5 w-5 mr-2 md:mr-2 transition-transform group-hover:scale-110 duration-300" />
          <span className="hidden md:inline font-medium">Habitats</span>
        </TabsTrigger>
        <TabsTrigger
          value="stats"
          className="relative py-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-blue-500 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-md text-blue-200 transition-all duration-300 hover:bg-blue-600/60 hover:text-white group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 opacity-0 data-[state=active]:opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
          <BarChart3 className="h-5 w-5 mr-2 md:mr-2 transition-transform group-hover:scale-110 duration-300" />
          <span className="hidden md:inline font-medium">Collection Stats</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="catalog" className="space-y-6">
        <EncyclopediaCatalog
          filters={encyclopediaState.filters}
          setFilters={encyclopediaState.setFilters}
          showFilters={encyclopediaState.showFilters}
          setShowFilters={encyclopediaState.setShowFilters}
          sortedFish={encyclopediaState.sortedFish}
          handleFishClick={encyclopediaState.handleFishClick}
          resetFilters={encyclopediaState.resetFilters}
        />
      </TabsContent>
      <TabsContent value="habitats" className="space-y-6">
        <EncyclopediaHabitats />
      </TabsContent>
      <TabsContent value="stats" className="space-y-6">
        <EncyclopediaStats />
      </TabsContent>
    </>
  )
}