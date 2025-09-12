'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Footer } from '@/components/layout/footer';
import { SelectedFishPanel } from '@/components/mini-games/selected-fish-panel';
import { GameGrid } from '@/components/mini-games/game-grid';
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
    <div className='relative min-h-screen bg-gradient-to-b from-blue-600 to-blue-950'>
      <PageHeader
        title='Aqua Stark Arcade'
        backTo='/game'
        backText='Back to Game'
        rightContent={null}
      />

      <main className='relative z-10 max-w-7xl mx-auto px-4 py-4 sm:py-6 lg:py-8 flex flex-col gap-4 sm:gap-6 lg:gap-8'>
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

      <Footer />
    </div>
  );
}
