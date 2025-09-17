import { 
  Sparkles, 
  Loader2
} from 'lucide-react';

interface CleanButtonProps {
  dirtLevel: number;
  isDirty: boolean;
  needsCleaning: boolean;
  onToggleCleaningMode: () => void;
  isCleaningMode: boolean;
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
}

export function CleanButton({
  dirtLevel,
  isDirty,
  needsCleaning,
  onToggleCleaningMode,
  isCleaningMode,
  isLoading = false,
  className = '',
  disabled = false,
}: CleanButtonProps) {
  const handleCleanClick = () => {
    if (isLoading || disabled) return;
    onToggleCleaningMode();
  };

  const getButtonColor = () => {
    if (isLoading) return 'from-gray-400 to-gray-600';
    if (isCleaningMode) return 'from-pink-400 to-pink-600';
    if (needsCleaning) return 'from-pink-500 to-pink-700';
    if (isDirty) return 'from-pink-400 to-pink-600';
    return 'from-pink-300 to-pink-500';
  };

  const getButtonIcon = () => {
    if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;
    return <Sparkles className="h-5 w-5" />;
  };

  return (
    <button
      onClick={handleCleanClick}
      disabled={isLoading || disabled}
      className={`game-button bg-gradient-to-b text-white rounded-xl relative group cursor-pointer w-12 h-12 ${getButtonColor()} ${className}`}
    >
      <div className='flex items-center justify-center gap-2 w-full h-full'>
        {getButtonIcon()}
      </div>
      
      {/* Tooltip */}
      <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50'>
        {isLoading ? 'Loading...' : 
         isCleaningMode ? 'Sponge Mode Active' : 
         needsCleaning ? 'Needs Cleaning' : 
         isDirty ? 'Clean Aquarium' : 'Clean'}
        {dirtLevel > 0 && ` (${Math.round(dirtLevel)}%)`}
      </div>
    </button>
  );
}
