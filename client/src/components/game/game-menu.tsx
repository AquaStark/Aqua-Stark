import {
  Volume2,
  Trophy,
  ShoppingBag,
  HelpCircle,
  Camera,
  Home,
  Settings,
  Fish,
  Sparkles,
} from 'lucide-react';
import { GameButton } from './game-button';
import { motion, AnimatePresence } from 'framer-motion';

interface GameMenuProps {
  show: boolean;
}

export function GameMenu({ show }: GameMenuProps) {
  const menuItems = [
    {
      icon: <Volume2 className='h-5 w-5' />,
      onClick: () => {},
      tooltip: 'Volume',
    },
    {
      icon: <Trophy className='h-5 w-5' />,
      onClick: () => {},
      tooltip: 'Achievements',
    },
    {
      icon: <ShoppingBag className='h-5 w-5' />,
      onClick: () => {},
      tooltip: 'Shop',
    },
    {
      icon: <HelpCircle className='h-5 w-5' />,
      onClick: () => {},
      tooltip: 'Help',
    },
    {
      icon: <Camera className='h-5 w-5' />,
      onClick: () => {},
      tooltip: 'Screenshot',
    },
    { icon: <Home className='h-5 w-5' />, onClick: () => {}, tooltip: 'Home' },
    {
      icon: <Settings className='h-5 w-5' />,
      onClick: () => {},
      tooltip: 'Settings',
    },
    // Debug buttons
    {
      icon: <Fish className='h-5 w-5' />,
      onClick: () => {
        const feedingDebug = document.querySelector('[data-feeding-debug]');
        if (feedingDebug) {
          feedingDebug.classList.toggle('hidden');
        }
      },
      tooltip: 'Feeding Debug',
    },
    {
      icon: <Sparkles className='h-5 w-5' />,
      onClick: () => {
        const dirtDebug = document.querySelector('[data-dirt-debug]');
        if (dirtDebug) {
          dirtDebug.classList.toggle('hidden');
        }
      },
      tooltip: 'Dirt Debug',
    },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className='absolute top-28 right-0 z-50 flex flex-col gap-2 transform -translate-x-[100%]'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
            >
              <GameButton
                icon={item.icon}
                onClick={item.onClick}
                tooltip={item.tooltip}
                className='w-12 h-12 rounded-xl bg-blue-500/30 hover:bg-blue-500/50 backdrop-blur-sm text-white border border-blue-400/40 shadow-lg hover:shadow-blue-400/30 transition-all duration-200 hover:scale-105'
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
