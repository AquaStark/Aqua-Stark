import { Maximize, Minimize } from 'lucide-react';
import { Button } from './button';
import { useFullscreen } from '@/hooks/use-fullscreen';

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
  const { isFullscreen, toggleFullscreen, isSupported } = useFullscreen();

  if (!isSupported) {
    return null;
  }

  const handleClick = () => {
    toggleFullscreen();
  };

  return (
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
  );
}
