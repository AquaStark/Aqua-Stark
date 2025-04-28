import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Droplet, BarChart3 } from "lucide-react";
import { useEncyclopedia } from "@/hooks/use-encyclopedia";
import EncyclopediaCatalog from "@/components/encyclopedia/encyclopedia-catalog";
import EncyclopediaHabitats from "@/components/encyclopedia/encyclopedia-habitats";
import EncyclopediaStats from "@/components/encyclopedia/encyclopedia-stats";

export default function EncyclopediaTabs() {
  useEncyclopedia();

  return (
    <>
      <TabsList className="grid grid-cols-3 mb-6 bg-blue-800/50 border border-blue-700/50">
        <TabsTrigger
          value="catalog"
          className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
        >
          <Book className="h-4 w-4 mr-2 md:mr-1" />
          <span className="hidden md:inline">Fish Catalog</span>
        </TabsTrigger>
        <TabsTrigger
          value="habitats"
          className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
        >
          <Droplet className="h-4 w-4 mr-2 md:mr-1" />
          <span className="hidden md:inline">Habitats</span>
        </TabsTrigger>
        <TabsTrigger
          value="stats"
          className="data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-200"
        >
          <BarChart3 className="h-4 w-4 mr-2 md:mr-1" />
          <span className="hidden md:inline">Collection Stats</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="catalog" className="space-y-6">
        <EncyclopediaCatalog />
      </TabsContent>
      <TabsContent value="habitats" className="space-y-6">
        <EncyclopediaHabitats />
      </TabsContent>
      <TabsContent value="stats" className="space-y-6">
        <EncyclopediaStats />
      </TabsContent>
    </>
  );
}
