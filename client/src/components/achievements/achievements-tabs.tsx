'use client';

import { Calendar, Star, Target, Trophy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Achievements } from './achievements';
import { Missions } from './missions';
import { LoginRewards } from './login-rewards';
import { Milestones } from './milestones';
import { mockGameMilestones, mockLoginRewards } from '@/data/mock-data';

interface AchievementsTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function AchievementsTabs({
  activeTab,
  setActiveTab,
}: AchievementsTabsProps) {
  const tabs = [
    {
      id: 'achievements',
      name: 'Achievements',
      icon: Trophy,
      color: 'from-amber-400 to-amber-500',
    },
    {
      id: 'missions',
      name: 'Missions',
      icon: Target,
      color: 'from-blue-400 to-blue-500',
    },
    {
      id: 'login_rewards',
      name: 'Login Rewards',
      icon: Calendar,
      color: 'from-orange-400 to-rose-500',
    },
    {
      id: 'milestones',
      name: 'Milestones',
      icon: Star,
      color: 'from-violet-400 to-violet-500',
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
      <TabsList className='grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-transparent mb-8'>
        {tabs.map(({ id, name, icon: Icon, color }) => (
          <TabsTrigger
            key={id}
            value={id}
            className={`
              flex items-center gap-3 px-4 py-6
              bg-gradient-to-b ${color}
              rounded-xl text-white font-medium
              shadow-lg transition-all duration-300
              hover:shadow-xl hover:scale-105 hover:brightness-110
              data-[state=active]:scale-105 data-[state=active]:ring-2 data-[state=active]:ring-white
              group relative overflow-hidden
            `}
          >
            <Icon size={20} className='text-white relative z-10' />
            <span className='text-sm md:text-base relative z-10'>{name}</span>
            {/* Glow effect */}
            <div
              className={`
              absolute inset-0 opacity-0 
              group-hover:opacity-100 transition-opacity duration-300
              bg-gradient-to-r ${color} blur-xl
            `}
            ></div>
          </TabsTrigger>
        ))}
      </TabsList>

      <div className='space-y-6'>
        <TabsContent value='achievements' className='mt-0'>
          <Achievements />
        </TabsContent>
        <TabsContent value='missions' className='mt-0'>
          <Missions />
        </TabsContent>
        <TabsContent value='login_rewards' className='mt-0'>
          <LoginRewards data={mockLoginRewards} />
        </TabsContent>
        <TabsContent value='milestones' className='mt-0'>
          <Milestones data={mockGameMilestones} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
