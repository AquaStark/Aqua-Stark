'use client';

import { UnderConstruction } from '@/components/ui/under-construction';
import { PageHeader } from '@/components';
import { Calendar, Trophy, Star, Gift } from 'lucide-react';

export default function EventsCalendarPage() {
  return (
    <UnderConstruction 
      pageName="Events Calendar"
      description="We're planning amazing underwater events! Soon you'll discover special fish, participate in tournaments, and join seasonal celebrations."
    >
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
        <PageHeader title="Events Calendar" backTo="/game" backText="Back to Game" />
        
        <div className="container mx-auto px-4 py-8">
          {/* Active Events */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Active Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-6">
                  <div className="w-full h-40 bg-blue-700/30 rounded-lg mb-4"></div>
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <div className="h-5 bg-blue-700/30 rounded flex-1"></div>
                  </div>
                  <div className="h-4 bg-blue-700/30 rounded mb-2"></div>
                  <div className="h-4 bg-blue-700/30 rounded w-3/4 mb-4"></div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg">
                    Join Event
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-300" />
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-700/30 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-blue-700/30 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-blue-700/30 rounded w-64"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">15</div>
                    <div className="text-sm text-blue-300">Days</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seasonal Rewards */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Gift className="w-6 h-6 text-pink-400" />
              Seasonal Rewards
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-blue-800/30 border border-blue-600/30 rounded-lg p-4 text-center">
                  <div className="w-20 h-20 mx-auto bg-blue-700/30 rounded-lg mb-3"></div>
                  <div className="h-4 bg-blue-700/30 rounded mb-2"></div>
                  <div className="h-3 bg-blue-700/30 rounded w-16 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </UnderConstruction>
  );
}