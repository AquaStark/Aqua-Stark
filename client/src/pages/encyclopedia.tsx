'use client';

import { UnderConstruction } from '@/components/ui/under-construction';
import { PageHeader } from '@/components';
import { Search, BookOpen } from 'lucide-react';

export default function EncyclopediaPage() {
  return (
    <UnderConstruction 
      pageName="Encyclopedia"
      description="We're creating an incredible underwater knowledge base! Soon you'll be able to discover detailed information about every fish species, their habitats, and care requirements."
    >
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
        <PageHeader title="Fish Encyclopedia" backTo="/game" backText="Back to Game" />
        
        <div className="container mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search species..."
                className="w-full pl-12 pr-4 py-3 bg-blue-800/50 border border-blue-600/30 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Species Categories */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].map((category) => (
              <button key={category} className="px-4 py-2 bg-blue-800/30 border border-blue-600/30 rounded-lg text-blue-200 whitespace-nowrap">
                {category}
              </button>
            ))}
          </div>

          {/* Species Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-4 hover:border-blue-500/50 transition-colors cursor-pointer">
                <div className="w-full h-32 bg-blue-700/30 rounded-lg mb-3"></div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <div className="h-4 bg-blue-700/30 rounded flex-1"></div>
                </div>
                <div className="h-3 bg-blue-700/30 rounded mb-2"></div>
                <div className="h-3 bg-blue-700/30 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UnderConstruction>
  );
}