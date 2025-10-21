import { Maximize, Minimize } from 'lucide-react';
import { useFullscreen } from '@/hooks/use-fullscreen';
import { useState } from 'react';
import { FullscreenModal } from './fullscreen-modal';

interface FullscreenButtonProps {
  className?: string;
}

export function FullscreenButton({
  className = '',
}: FullscreenButtonProps) {
  const { isFullscreen, toggleFullscreen, isSupported, enterFullscreen } =
    useFullscreen();
  const [showModal, setShowModal] = useState(false);

  if (!isSupported) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFullscreen) {
      toggleFullscreen();
    } else {
      // Show modal to ask for fullscreen permission
      setShowModal(true);
    }
  };

  const handleAcceptFullscreen = async () => {
    await enterFullscreen();
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`game-button p-2 text-white hover:bg-blue-500/50 rounded-lg transition-colors flex-shrink-0 ${className}`}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <Minimize className='h-4 w-4 sm:h-5 sm:w-5' />
        ) : (
          <Maximize className='h-4 w-4 sm:h-5 sm:w-5' />
        )}
      </button>

      <FullscreenModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onAccept={handleAcceptFullscreen}
      />
    </>
  );
}
