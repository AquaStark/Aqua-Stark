import { PageHeader } from '@/components';
import { LayoutFooter } from '@/components';
import { OrientationLock } from '@/components/ui';
import { FloppyFishGame } from '@/components';

export default function FloppyFishGamePage() {
  const selectedFish = {
    id: 'fish001',
    name: 'Aqua Puffer',
    image: '/fish/fish1.png',
    experienceMultiplier: 1.0,
  };

  return (
    <OrientationLock>
      <div className='relative min-h-screen bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 overflow-hidden'>
        <PageHeader
          title='Floppy Fish Minigame'
          backTo='/mini-games'
          backText='Back to Arcade'
          rightContent={null}
        />
        <main className='relative z-10 w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8 flex flex-col gap-4 sm:gap-8 items-center'>
          <FloppyFishGame selectedFish={selectedFish} />
        </main>
        <LayoutFooter />
      </div>
    </OrientationLock>
  );
}
