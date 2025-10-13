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

      <main className='relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 lg:py-8 flex flex-col gap-4 sm:gap-6 lg:gap-8'>
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
        <GameGrid games={allGames} onGameSelect={handleGameClick} />
      </main>

      <LayoutFooter />
      </div>
    </OrientationLock>
  );
}
