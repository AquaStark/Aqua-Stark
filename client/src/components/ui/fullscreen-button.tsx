import { Maximize, Minimize } from 'lucide-react';
import { useFullscreen } from '@/hooks/use-fullscreen';

export function FullscreenButton() {
  const { isFullscreen, toggleFullscreen, isSupported } = useFullscreen();

  if (!isSupported) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFullscreen();
  };

  return (
    <button
      onClick={handleClick}
      className='game-button p-2 text-white hover:bg-blue-500/50 rounded-lg transition-colors flex-shrink-0'
      title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      {isFullscreen ? (
        <Minimize className='h-4 w-4 sm:h-5 sm:w-5' />
      ) : (
        <Maximize className='h-4 w-4 sm:h-5 sm:w-5' />
      )}
    </button>
  );
}
