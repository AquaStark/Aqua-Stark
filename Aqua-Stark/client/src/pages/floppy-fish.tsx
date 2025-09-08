import { PageHeader } from '@/components/layout/page-header';
import { Footer } from '@/components/layout/footer';
import { useGames } from '@/hooks/use-games';
import { FloppyFishGame } from '@/components/mini-games/floppy-fish-game';

export default function FloppyFishGamePage() {
  const { selectedFish } = useGames();

  return (
    <div className='relative min-h-screen bg-gradient-to-b from-blue-600 to-blue-950 overflow-hidden'>
      <PageHeader
        title='Floppy Fish Minigame'
        backTo='/mini-games'
        backText='Back to Arcade'
        rightContent={null}
      />
      <main className='relative z-10 max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8 items-center'>
        <FloppyFishGame selectedFish={selectedFish} />
      </main>
      <Footer />
    </div>
  );
}
