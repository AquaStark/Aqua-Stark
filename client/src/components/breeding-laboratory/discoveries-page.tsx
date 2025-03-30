import { DiscoveriesStats } from "./discoveries-stats"
import { DiscoveryRegistry } from "./discovery-registry";
import { UndiscoveredSpecies } from "./undiscovered-species";
import { Filter, Search } from "lucide-react";

import { discoveriesData, undiscoveredSpeciesData } from "@/data/breeding-data";
const stats = [
    { title: 'Total Discoveries', value: discoveriesData.length },
    { 
      title: 'Rare+ Discoveries', 
      value: discoveriesData.filter(d => d.rarity === 'Rare' || d.rarity === 'Epic').length 
    },
    { 
      title: 'Special Traits', 
      value: discoveriesData.filter(d => d.traits.includes('Special')).length 
    },
    { 
      title: 'Completion', 
      value: `${Math.round((discoveriesData.length / (discoveriesData.length + undiscoveredSpeciesData.length)) * 100)}%` 
    }
  ];

export default function DiscoveriesPage() {

    return (
        <div>
             <div className="flex items-center justify-between my-8">
          <h2 className="text-gray-100 text-lg">Breeding Discoveries</h2>
          <div className="flex justify-center items-center gap-8">
            <div className="bg-blue-600/30 flex items-center px-2 py-1 gap-6 rounded border border-blue-600/60">
              <input type="text" placeholder="Search discoveries" className="bg-transparent px-2 py-1" />
              <Search size={16} />
            </div>
            <div className="relative">
              <div className="flex items-center rounded gap-2 bg-blue-900/40 px-3 py-2 cursor-pointer hover:bg-blue-800/60 transition-colors duration-200">
                <Filter size={16} />
                <span>Filter</span>
              </div>
            </div>
          </div>
        </div>
<DiscoveriesStats stats={stats} />
<DiscoveryRegistry discoveries={discoveriesData} />
<UndiscoveredSpecies species={undiscoveredSpeciesData} />
        </div>
    )
}