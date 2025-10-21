'use client';

import { UnderConstruction } from '@/components/ui/under-construction';
import { PageHeader } from '@/components';
import { Heart, Plus } from 'lucide-react';

export default function BreedingLaboratoryPage() {
  return (
    <UnderConstruction 
      pageName="Breeding Laboratory"
      description="We're creating an amazing underwater breeding facility! Soon you'll be able to breed unique fish combinations and discover new species."
    >
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
        <PageHeader title="Breeding Laboratory" showBackButton={true} backButtonText="Back to Game" />
        
        <div className="container mx-auto px-4 py-8">
          {/* Breeding Slots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-6 text-center">
              <div className="w-32 h-32 mx-auto bg-blue-700/30 rounded-lg mb-4"></div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Select Parent 1</button>
            </div>
            <div className="flex items-center justify-center">
              <Plus className="w-12 h-12 text-blue-400" />
            </div>
            <div className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-6 text-center">
              <div className="w-32 h-32 mx-auto bg-blue-700/30 rounded-lg mb-4"></div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Select Parent 2</button>
            </div>
          </div>

          {/* Breed Button */}
          <div className="text-center mb-8">
            <button className="px-8 py-3 bg-pink-600 text-white rounded-lg flex items-center gap-2 mx-auto">
              <Heart className="w-5 h-5" />
              Start Breeding
            </button>
          </div>

          {/* Previous Breeds */}
          <h3 className="text-xl font-bold text-white mb-4">Previous Breeds</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-4">
                <div className="w-full h-40 bg-blue-700/30 rounded-lg mb-3"></div>
                <div className="h-4 bg-blue-700/30 rounded mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UnderConstruction>
  );
}