// components/ui/Tabs.tsx
import React from 'react';
import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="flex border-b border-blue-600/30 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'px-4 py-2 text-sm transition-colors',
            activeTab === tab.id 
              ? 'border-b-2 border-purple-500 text-white' 
              : 'text-blue-300 hover:text-white'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
