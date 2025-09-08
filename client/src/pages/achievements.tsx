import { useState, useEffect } from 'react';
import { BubblesBackground } from '@/components/bubble-background';
import { useBubbles } from '@/hooks/use-bubbles';
import { PageHeader } from '@/components/layout/page-header';
import { Footer } from '@/components/layout/footer';
import { Trophy } from 'lucide-react';
import { AchievementsTabs } from '@/components/achievements/achievements-tabs';
import { ComingSoonModal } from '@/components/ui/coming-soon-modal';

export default function AchievementsPage() {
  const bubbles = useBubbles();
  const [activeTab, setActiveTab] = useState('achievements');
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Mostrar el modal automáticamente al cargar la página
  useEffect(() => {
    setShowComingSoon(true);
  }, []);

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900'>
      {/* Background with bubbles */}
      <BubblesBackground
        bubbles={bubbles}
        className='opacity-60'
        customStyles={{
          background:
            'linear-gradient(180deg, rgba(59,130,246,0.1) 0%, rgba(29,78,216,0.2) 100%)',
        }}
      />

      <PageHeader
        title='Achievements & Rewards'
        backTo='/'
        backText='Back to Game'
        className='bg-blue-900/60 backdrop-blur-md border-b border-blue-400/30'
        rightContent={
          <div className='flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-amber-400/30'>
            <Trophy className='text-amber-400 h-5 w-5' />
            <span className='text-amber-100 font-bold'>2/8</span>
          </div>
        }
      />

      {/* Main content */}
      <main className='relative z-20 flex flex-col items-center px-4 py-8 mx-auto max-w-7xl'>
        <div className='w-full backdrop-blur-md rounded-2xl p-6'>
          <AchievementsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </main>

      <Footer className='bg-blue-900/60 backdrop-blur-md border-t border-blue-400/30' />

      {/* Modal Coming Soon */}
      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        title='Achievements Under Development'
        description="The achievements system is being built. Soon you'll unlock badges, rewards, and track your progress in Aqua Stark."
        closable={false}
      />
    </div>
  );
}
