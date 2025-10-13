import { PageHeader } from '@/components';
import { LayoutFooter } from '@/components';
import { OrientationLock } from '@/components/ui';
import { useGames } from '@/hooks';
import { FloppyFishGame } from '@/components';

export default function FloppyFishGamePage() {
  const { selectedFish } = useGames();

  return (
    <OrientationLock>
      <div className='relative min-h-screen bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 overflow-hidden'>
        <PageHeader
          title='Floppy Fish Minigame'
          backTo='/mini-games'
          backText='Back to Arcade'
          rightContent={null}
        />
        <main className='relative z-10 max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8 items-center'>
          <FloppyFishGame selectedFish={selectedFish} />
        </main>
        <LayoutFooter />
      </div>
    </OrientationLock>
  );
}
