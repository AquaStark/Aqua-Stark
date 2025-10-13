'use client';

import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface OrientationLockProps {
  children: React.ReactNode;
  className?: string;
}

export function OrientationLock({ children, className = '' }: OrientationLockProps) {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const isPortraitMode = window.innerHeight > window.innerWidth;
      
      setIsMobile(isMobileDevice);
      setIsPortrait(isPortraitMode);
    };

    // Check on mount
    checkOrientation();

    // Listen for orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // If not mobile or already in landscape, show children
  if (!isMobile || !isPortrait) {
    return <div className={className}>{children}</div>;
  }

  // Show orientation lock screen for mobile portrait
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-800 flex items-center justify-center">
      <div className="text-center p-8 max-w-sm mx-auto">
        {/* Rotate Icon Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <RotateCcw 
              size={80} 
              className="text-white animate-spin" 
              style={{ animationDuration: '2s' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-4 select-none">
          Gira tu dispositivo
        </h1>

        {/* Description */}
        <p className="text-white/90 text-lg mb-6 select-none">
          Para una mejor experiencia de juego, por favor gira tu dispositivo a modo horizontal
        </p>

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <p className="text-white/80 text-sm select-none">
            📱 → 📱<br />
            Gira tu teléfono 90° hacia la izquierda o derecha
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-8 w-6 h-6 border-2 border-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-8 left-8 w-4 h-4 border-2 border-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-4 right-4 w-10 h-10 border-2 border-white/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
}
