'use client';

import { PageHeader } from '@/components';
import { LayoutFooter } from '@/components';
import { SelectedFishPanel } from '@/components';
import { GameGrid } from '@/components';
import { OrientationLock } from '@/components/ui';
import { useGames } from '@/hooks';

export default function GamesPage() {
  const {
    selectedFish,
    setSelectedFish,
    allGames,
    handleGameClick,
    availableFish,
  } = useGames();

  return (
    <OrientationLock>
      <div className='relative min-h-screen bg-gradient-to-b from-blue-600 to-blue-950'>
        <PageHeader
          title='Aqua Stark Arcade'
          backTo='/game'
          backText='Back to Game'
          rightContent={null}
        />

        <main className='relative z-10 w-full max-w-7xl mx-auto px-0.5 sm:px-1 md:px-2 lg:px-4 py-1 sm:py-2 md:py-3 lg:py-4 flex flex-col gap-1 sm:gap-2 md:gap-3 lg:gap-4'>
          {/* Fish panel - ultra compact on mobile */}
          <div className='px-0.5 sm:px-1'>
            <SelectedFishPanel
              selectedFish={selectedFish}
              onChangeFish={() => {
                // Aquí luego se abrirá un modal o dropdown
                // Por ahora solo cambiamos al siguiente pez para prueba
                const currentIndex = availableFish.findIndex(
                  f => f.id === selectedFish.id
                );
                const nextIndex = (currentIndex + 1) % availableFish.length;
                setSelectedFish(availableFish[nextIndex]);
              }}
              availableFish={availableFish}
            />
          </div>

          {/* Game grid - takes most of the space */}
          <div className='flex-1 px-0.5 sm:px-1'>
            <GameGrid games={allGames} onGameSelect={handleGameClick} />
          </div>
        </main>

        <LayoutFooter />
      </div>
    </OrientationLock>
  );
}
