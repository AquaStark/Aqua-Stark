import { useState, useEffect } from 'react';
import { useFullscreen } from '@/hooks/use-fullscreen';
import { Maximize, X } from 'lucide-react';

export function FullscreenDebug() {
  const { isFullscreen, enterFullscreen, isSupported, isEnabled } = useFullscreen();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Show notification after 1 second if conditions are met
    const timer = setTimeout(() => {
      if (isSupported && isEnabled && !isFullscreen) {
        // Check if user hasn't been prompted before
        const hasBeenPrompted = localStorage.getItem('aqua-stark-fullscreen-prompted');
        if (!hasBeenPrompted) {
          setShowNotification(true);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSupported, isEnabled, isFullscreen]);

  const handleAccept = async () => {
    localStorage.setItem('aqua-stark-fullscreen-prompted', 'true');
    setShowNotification(false);
    await enterFullscreen();
  };

  const handleDecline = () => {
    localStorage.setItem('aqua-stark-fullscreen-prompted', 'true');
    setShowNotification(false);
  };

  if (!showNotification) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-blue-900/95 backdrop-blur-sm border border-blue-400/50 rounded-lg px-4 py-3 shadow-lg">
      <div className="flex items-center gap-3">
        <Maximize className="h-5 w-5 text-blue-300" />
        <span className="text-white font-medium">Go Full Screen?</span>
        <button
          onClick={handleAccept}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Yes
        </button>
        <button
          onClick={handleDecline}
          className="text-blue-300 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
