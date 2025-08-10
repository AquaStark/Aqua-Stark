import { Fish, Timer, Clock } from 'lucide-react';
import { GameButton } from './game-button';

interface FeedFishButtonProps {
  isFeeding: boolean;
  timeRemaining: number;
  onStartFeeding: () => void;
  onStopFeeding: () => void;
  disabled?: boolean;
  className?: string;
}

export function FeedFishButton({
  isFeeding,
  timeRemaining,
  onStartFeeding,
  onStopFeeding,
  disabled = false,
  className = '',
}: FeedFishButtonProps) {
  const handleClick = () => {
    if (isFeeding) {
      onStopFeeding();
    } else {
      onStartFeeding();
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  const progress =
    isFeeding && timeRemaining > 0
      ? ((30000 - timeRemaining) / 30000) * 100
      : 0;

  return (
    <div className={`relative ${className}`}>
      <GameButton
        icon={
          isFeeding ? (
            <Timer className='h-5 w-5' />
          ) : (
            <Fish className='h-5 w-5' />
          )
        }
        text={isFeeding ? 'Stop Feeding' : 'Feed Fish'}
        color={
          isFeeding
            ? 'from-orange-500 to-red-600 shadow-lg shadow-orange-500/25'
            : 'from-green-400 to-blue-500 shadow-lg shadow-green-400/25'
        }
        onClick={handleClick}
        disabled={disabled}
        className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
          isFeeding ? 'animate-pulse' : ''
        }`}
      />

      {/* Progress indicator when feeding */}
      {isFeeding && (
        <div className='absolute inset-0 pointer-events-none'>
          <div
            className='absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-1000 ease-linear'
            style={{ width: `${progress}%` }}
          />

          {/* Time remaining indicator */}
          <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap'>
            <Clock className='inline h-3 w-3 mr-1' />
            {formatTime(timeRemaining)}
          </div>
        </div>
      )}

      {/* Feeding particles effect */}
      {isFeeding && (
        <div className='absolute inset-0 pointer-events-none overflow-hidden rounded-xl'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping'
              style={{
                left: `${20 + i * 12}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '1.5s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
