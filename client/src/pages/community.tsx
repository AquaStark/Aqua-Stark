'use client';

import { UnderConstruction } from '@/components/ui/under-construction';
import { PageHeader } from '@/components';
import { Users, MessageCircle, Trophy } from 'lucide-react';

export default function CommunityPage() {
  return (
    <UnderConstruction
      pageName='Community'
      description="We're building an amazing underwater community hub! Soon you'll be able to connect with other aquarists, share your fish, and join exciting events."
    >
      <div className='min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900'>
        <PageHeader title='Community' backTo='/game' backText='Back to Game' />

        <div className='container mx-auto px-4 py-8'>
          {/* Tabs */}
          <div className='flex gap-2 mb-6'>
            {['Friends', 'Global Chat', 'Leaderboard'].map(tab => (
              <button
                key={tab}
                className='px-4 py-2 bg-blue-800/30 border border-blue-600/30 rounded-lg text-blue-200'
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Players List */}
          <div className='space-y-4'>
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className='bg-blue-800/30 border border-blue-600/30 rounded-lg p-4 flex items-center gap-4'
              >
                <div className='w-12 h-12 bg-blue-700/30 rounded-full'></div>
                <div className='flex-1'>
                  <div className='h-4 bg-blue-700/30 rounded w-32 mb-2'></div>
                  <div className='h-3 bg-blue-700/30 rounded w-48'></div>
                </div>
                <div className='flex gap-2'>
                  <button className='p-2 bg-blue-600 rounded-lg'>
                    <MessageCircle className='w-4 h-4 text-white' />
                  </button>
                  <button className='p-2 bg-blue-600 rounded-lg'>
                    <Users className='w-4 h-4 text-white' />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Top Players */}
          <div className='mt-8'>
            <h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
              <Trophy className='w-6 h-6 text-yellow-400' />
              Top Players This Week
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className='bg-blue-800/30 border border-blue-600/30 rounded-lg p-4 text-center'
                >
                  <div className='w-16 h-16 mx-auto bg-blue-700/30 rounded-full mb-3'></div>
                  <div className='h-4 bg-blue-700/30 rounded mb-2'></div>
                  <div className='h-3 bg-blue-700/30 rounded w-20 mx-auto'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </UnderConstruction>
  );
}
