'use client';

import { useNavigate } from 'react-router-dom';
import { OrientationLock } from '@/components/ui';
import { MobileFloppyFishGame } from './mobile-floppy-fish-game';

export function MobileFloppyFishView() {
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
      <div className='relative h-screen bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 overflow-hidden'>
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
            <h3 className='text-xs font-semibold text-white'>Floppy Fish</h3>
            <div className='w-12'></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Game area - takes most of the screen */}
        <main className='relative z-10 w-full flex items-start justify-center px-1 pt-1 pb-2' style={{ height: 'calc(100vh - 60px)' }}>
          <div className='w-full h-full'>
            <MobileFloppyFishGame selectedFish={selectedFish} />
          </div>
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
