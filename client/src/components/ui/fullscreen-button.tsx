import { Maximize, Minimize } from 'lucide-react';
import { Button } from './button';
import { useFullscreen } from '@/hooks/use-fullscreen';
import { useState } from 'react';
import { FullscreenModal } from './fullscreen-modal';

interface FullscreenButtonProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

export function FullscreenButton({
  className = '',
  variant = 'ghost',
  size = 'default',
}: FullscreenButtonProps) {
  const { isFullscreen, toggleFullscreen, isSupported, enterFullscreen } =
    useFullscreen();
  const [showModal, setShowModal] = useState(false);

  if (!isSupported) {
    return null;
  }

  const handleClick = () => {
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
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={`${className} transition-all duration-200`}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <Minimize className='h-4 w-4' />
        ) : (
          <Maximize className='h-4 w-4' />
        )}
      </Button>

      <FullscreenModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onAccept={handleAcceptFullscreen}
      />
    </>
  );
}
