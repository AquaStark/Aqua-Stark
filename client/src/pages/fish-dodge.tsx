'use client';

import { PageHeader } from '@/components';
import { LayoutFooter } from '@/components';
import { OrientationLock } from '@/components/ui';
import { FishDodgeGame } from '@/components';

export default function FishDodgePage() {
  const selectedFish = {
    id: 'fish001',
    name: 'Aqua Puffer',
    image: '/fish/fish1.png',
    experienceMultiplier: 1.0,
  };

  return (
    <OrientationLock>
      <div className='relative h-screen bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 overflow-hidden flex flex-col'>
        <PageHeader
          title='Fish Dodge'
          backTo='/mini-games'
          backText='Back to Arcade'
          rightContent={null}
        />
        <main className='relative z-10 w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6 items-center flex-1 justify-center'>
          <FishDodgeGame selectedFish={selectedFish} />
        </main>
        <LayoutFooter />
      </div>
    </OrientationLock>
  );
}
