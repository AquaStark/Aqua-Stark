import { useLoadingNavigation } from '@/hooks/use-loading-navigation';
import { motion } from 'framer-motion';

interface PlayButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export function PlayButton({
  className = '',
  children = 'Jugar',
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
}: PlayButtonProps) {
  const { startGameWithLoading } = useLoadingNavigation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      startGameWithLoading();
    }
  };

  const baseClasses =
    'font-bold rounded-xl shadow-xl transform hover:scale-105 transition-all duration-200 border-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const variantClasses = {
    primary:
      'bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 border-blue-300 text-white',
    secondary:
      'bg-gradient-to-b from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 border-purple-300 text-white',
    outline:
      'bg-transparent border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.button>
  );
}
