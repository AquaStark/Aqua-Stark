'use client';

import { UnderConstruction } from '@/components/ui/under-construction';
import { PageHeader } from '@/components';
import { Award, Trophy, Star, Lock } from 'lucide-react';

export default function AchievementsPage() {
  return (
    <UnderConstruction 
      pageName="Achievements"
      description="We're creating an incredible achievement system! Soon you'll unlock badges, complete challenges, and showcase your underwater accomplishments."
    >
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
        <PageHeader title="Achievements" showBackButton={true} backButtonText="Back to Game" />
        
        <div className="container mx-auto px-4 py-8">
          {/* Progress Summary */}
          <div className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Your Progress
              </h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">24/100</div>
                <div className="text-sm text-blue-300">Achievements Unlocked</div>
              </div>
            </div>
            <div className="w-full h-3 bg-blue-700/30 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-1/4"></div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['All', 'Collection', 'Breeding', 'Trading', 'Social', 'Events'].map((category) => (
              <button key={category} className="px-4 py-2 bg-blue-800/30 border border-blue-600/30 rounded-lg text-blue-200 whitespace-nowrap">
                {category}
              </button>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Unlocked Achievements */}
            {[1, 2, 3, 4].map((i) => (
              <div key={`unlocked-${i}`} className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
                <div className="w-full aspect-square bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-3 flex items-center justify-center">
                  <Award className="w-12 h-12 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <div className="h-4 bg-blue-700/30 rounded flex-1"></div>
                </div>
                <div className="h-3 bg-blue-700/30 rounded mb-2"></div>
                <div className="text-xs text-green-400 font-semibold">Unlocked!</div>
              </div>
            ))}
            
            {/* Locked Achievements */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={`locked-${i}`} className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-4 opacity-60">
                <div className="w-full aspect-square bg-blue-700/30 rounded-lg mb-3 flex items-center justify-center">
                  <Lock className="w-12 h-12 text-blue-500" />
                </div>
                <div className="h-4 bg-blue-700/30 rounded mb-2"></div>
                <div className="h-3 bg-blue-700/30 rounded w-3/4 mb-2"></div>
                <div className="text-xs text-blue-400">Locked</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UnderConstruction>
  );
}