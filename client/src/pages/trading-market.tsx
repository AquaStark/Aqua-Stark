'use client';

import { UnderConstruction } from '@/components/ui/under-construction';
import { PageHeader } from '@/components';
import { Search, Filter } from 'lucide-react';

export default function MarketPage() {
  return (
    <UnderConstruction 
      pageName="Trading Market"
      description="We're building an incredible underwater marketplace! Soon you'll be able to trade, auction, and discover rare fish with other players."
    >
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
        <PageHeader title="Trading Market" showBackButton={true} backButtonText="Back to Game" />
        
        <div className="container mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-4 h-4" />
              <input
                type="text"
                placeholder="Search fish..."
                className="w-full pl-10 pr-4 py-2 bg-blue-800/50 border border-blue-600/30 rounded-lg text-white"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Mock Fish Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-4">
                <div className="w-full h-40 bg-blue-700/30 rounded-lg mb-3"></div>
                <div className="h-4 bg-blue-700/30 rounded mb-2"></div>
                <div className="h-4 bg-blue-700/30 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UnderConstruction>
  );
}