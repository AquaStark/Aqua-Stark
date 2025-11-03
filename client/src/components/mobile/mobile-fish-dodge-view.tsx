'use client';

import { useNavigate } from 'react-router-dom';
import { OrientationLock } from '@/components/ui';
import { FishDodgeGameMobile } from '@/components/mini-games/fish-dodge/mobile/fish-dodge-game-mobile';

export function MobileFishDodgeView() {
  const navigate = useNavigate();

  const selectedFish = {
    id: 'fish001',
    name: 'Aqua Puffer',
    image: '/fish/fish1.png',
    experienceMultiplier: 1.0,
  };

  const handleBack = () => {
    navigate('/mini-games');
  };

  return (
    <OrientationLock>
      <div
        className='relative h-screen w-screen bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 overflow-hidden'
        style={{ width: '100vw', maxWidth: '100vw' }}
      >
        {/* Minimal header */}
        <div className='relative z-10 p-1 bg-blue-700/90 backdrop-blur-sm border-b border-blue-400/50'>
          <div className='flex items-center justify-between'>
            <button
              onClick={handleBack}
              className='flex items-center text-white hover:bg-blue-500/50 px-1 py-0.5 rounded transition-colors'
            >
              <svg
                className='mr-1'
                width={14}
                height={14}
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='m12 19-7-7 7-7' />
                <path d='M19 12H5' />
              </svg>
              <span className='text-xs'>Back</span>
            </button>
            <h3 className='text-xs font-semibold text-white'>Fish Dodge</h3>
            <div className='w-12'></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Game area - takes full width and most of the screen */}
        <main
          className='relative z-10 w-full flex items-center justify-center'
          style={{
            height: 'calc(100vh - 80px)',
            width: '100vw',
            maxWidth: '100vw',
            padding: 0,
            margin: 0,
            paddingTop: '60px',
            paddingBottom: '40px',
          }}
        >
          <FishDodgeGameMobile selectedFish={selectedFish} />
        </main>

        {/* Minimal footer */}
        <footer className='absolute bottom-0 left-0 right-0 z-20 bg-blue-800/90 backdrop-blur-sm py-1 border-t border-blue-400/50'>
          <div className='text-center'>
            <p className='text-white/70 text-xs'>© 2025 Aqua Stark</p>
          </div>
        </footer>
      </div>
    </OrientationLock>
  );
}
