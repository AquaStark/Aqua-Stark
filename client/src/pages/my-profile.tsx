'use client';

import { useState, useEffect } from 'react';
import mockProfileData from '@/data/mock-my-profile';
import {
  ProfileHeader,
  ProfileCard,
  ProfileTabs,
  FishCollection,
  Achievements,
  PurchaseHistory,
  PlayerStatistics,
  BubblesBackground,
} from '@/components/profile';
import { useBubbles } from '@/hooks/use-bubbles';

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState('collection');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const bubbles = useBubbles({
    initialCount: 15,
    maxBubbles: 25,
    minSize: 6,
    maxSize: 30,
    minDuration: 8,
    maxDuration: 25,
    interval: 500,
  });

  const {
    username,
    level,
    joinDate,
    experience,
    currency,
    stats,
    fishCollection,
    playerStats,
  } = mockProfileData;

  return (
    <div className='min-h-screen bg-blue-700 text-white relative overflow-hidden'>
      {/* Background bubbles */}
      <BubblesBackground
        bubbles={bubbles}
        className='absolute inset-0 z-0 pointer-events-none'
      />

      {/* Content container */}
      <div
        className={`relative z-10 max-w-4xl mx-auto px-4 py-6 transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ProfileHeader currency={currency} />

        <ProfileCard
          username={username}
          level={level}
          joinDate={joinDate}
          experience={experience}
          stats={stats}
        />

        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className='animate-fadeIn transition-all duration-500'>
          {activeTab === 'collection' && (
            <FishCollection fishCollection={fishCollection} />
          )}
          {activeTab === 'achievements' && <Achievements stats={stats} />}
          {activeTab === 'purchase' && <PurchaseHistory />}
          <PlayerStatistics playerStats={playerStats} />
        </div>
      </div>
    </div>
  );
}
