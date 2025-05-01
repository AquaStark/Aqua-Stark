import { aquaticEnvironments } from "@/data/encyclopedia-habitat";
import HabitatCard from "../ui/HabitatCard";
import CompatabilityGuide from "../ui/CompatabilityGuide";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function EncyclopediaHabitats() {
 feat/updated-food-tab
  return (
    <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Fish Habitats</h2>
      <p className="text-blue-200">
        Here you can explore the different environments where fish species live.
        This section will include habitat details like water type, temperature,
        and more.
      </p>

  const [expandedSections, setExpandedSections] = useState({
    habitats: true,
    compatibility: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-gradient-to-b from-[#014eaa] to-[#012c5f] backdrop-blur-sm rounded-xl p-6 text-white space-y-6 border border-blue-600">
      <div>
        <div 
          className="flex justify-between items-center cursor-pointer" 
          onClick={() => toggleSection('habitats')}
        >
          <h2 className="text-base font-bold mb-4">Aquatic Habitats</h2>
          {expandedSections.habitats ? 
            <ChevronUp className="w-5 h-5" /> : 
            <ChevronDown className="w-5 h-5" />
          }
        </div>
        
        {expandedSections.habitats && (
          <>
            <p className="text-blue-200 text-sm">
              Different fish species thrive in specific habitats. Understanding these
              environments is crucial for creating the perfect aquarium conditions for
              your fish.
            </p>
            <div className="space-y-6 mt-4">
              {aquaticEnvironments.map((habitat) => (
                <HabitatCard key={habitat.name} habitat={habitat} />
              ))}
            </div>
          </>
        )}
      </div>

      <div>
        <div 
          className="flex justify-between items-center cursor-pointer" 
          onClick={() => toggleSection('compatibility')}
        >
          <h2 className="text-base font-bold mb-4">Compatibility Guide</h2>
          {expandedSections.compatibility ? 
            <ChevronUp className="w-5 h-5" /> : 
            <ChevronDown className="w-5 h-5" />
          }
        </div>
        
        {expandedSections.compatibility && <CompatabilityGuide />}
      </div>
 main
    </div>
  );
}
