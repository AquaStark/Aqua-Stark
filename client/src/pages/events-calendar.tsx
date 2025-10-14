'use client';

import { useState, useEffect } from 'react';
import { BubblesBackground } from '@/components';
import { LayoutFooter } from '@/components';
import { PageHeader } from '@/components';
import { useBubbles } from '@/hooks';
import { EventTabs } from '@/components';
import { ComingSoonModal } from '@/components';
import { OrientationLock } from '@/components/ui';

export default function EventsCalendarPage() {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const bubbles = useBubbles();

  // Mostrar el modal automáticamente al cargar la página
  useEffect(() => {
    setShowComingSoon(true);
  }, []);

  return (
    <OrientationLock>
      <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900 animated-background'>
      <BubblesBackground bubbles={bubbles} />

      <PageHeader
        title='Events Calendar'
        backTo='/game'
        backText='Back to Game'
      />

      <main className='relative z-20 flex flex-col items-center px-4 py-8 mx-auto max-w-7xl'>
        <EventTabs />
      </main>

      <LayoutFooter />

      {/* Modal Coming Soon */}
      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        title='Events Calendar Under Development'
        description="The events calendar is being built. Soon you'll be able to participate in special events, challenges, and seasonal activities."
        closable={false}
      />
      </div>
    </OrientationLock>
  );
}
