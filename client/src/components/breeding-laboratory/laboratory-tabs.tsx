import { Heart, Tangent, FileText, SatelliteDish } from "lucide-react";
import { useState } from "react";
import DiscoveriesPage from "./discoveries-page";
type Tab = 'breeding' | 'genetics' | 'discoveries' | 'genealogy';

interface TabItem {
  id: Tab;
  label: string;
  icon: React.ReactNode;
}

export function LaboratoryTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('discoveries');

  const tabs: TabItem[] = [
    { id: 'breeding', label: 'Breeding', icon: <Heart size={14} /> },
    { id: 'genetics', label: 'Genetics', icon: <Tangent size={14} /> },
    { id: 'discoveries', label: 'Discoveries', icon: <SatelliteDish size={14} /> },
    { id: 'genealogy', label: 'Genealogy', icon: <FileText size={14} /> },
  ];

  return (
    <div>
      <nav className="bg-blue-700 backdrop-blur-sm px-3 py-2 rounded-xl mt-8">
      <div className="text-gray-300 text-md flex justify-between w-[90%] mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`py-1 flex-1 mx-2 text-xs md:text-sm font-normal rounded-lg transition-all duration-200 flex items-center justify-center gap-1 ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-700 text-blue-100 hover:bg-blue-600/70'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
     
         
    </nav>
    {activeTab === "breeding" && <h4>hello breeding</h4>}
          {activeTab === "genetics" && <h4>hello genetics</h4>}
           {activeTab === "discoveries" && (
                      <DiscoveriesPage />
                    )}
          {activeTab === "genealogy" && <h4>hello genealogy</h4>}
    </div>
  );
}