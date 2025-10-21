import {
  Settings,
  HelpCircle,
  Users,
  User,
  BookOpen,
  Calendar,
  Award,
  ArrowLeft,
  TrendingUp,
  Heart,
} from 'lucide-react';
import { GameButton } from './game-button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface GameMenuProps {
  show: boolean;
}

interface MenuItem {
  icon: React.ReactNode;
  onClick: () => void;
  tooltip: string;
}

export function GameMenu({
  show,
}: GameMenuProps) {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    // Back to home
    {
      icon: <ArrowLeft className='h-5 w-5' />,
      onClick: () => navigate('/'),
      tooltip: 'Back to Home',
    },
    // Trading Market
    {
      icon: <TrendingUp className='h-5 w-5' />,
      onClick: () => navigate('/trading-market'),
      tooltip: 'Trading Market',
    },
    // Breeding Laboratory
    {
      icon: <Heart className='h-5 w-5' />,
      onClick: () => navigate('/breeding-laboratory'),
      tooltip: 'Breeding Lab',
    },
    // Settings
    {
      icon: <Settings className='h-5 w-5' />,
      onClick: () => navigate('/settings'),
      tooltip: 'Settings',
    },
    // Community
    {
      icon: <Users className='h-5 w-5' />,
      onClick: () => navigate('/community'),
      tooltip: 'Community',
    },
    // My Profile
    {
      icon: <User className='h-5 w-5' />,
      onClick: () => navigate('/my-profile'),
      tooltip: 'My Profile',
    },
    // Encyclopedia
    {
      icon: <BookOpen className='h-5 w-5' />,
      onClick: () => navigate('/encyclopedia'),
      tooltip: 'Encyclopedia',
    },
    // Help Center
    {
      icon: <HelpCircle className='h-5 w-5' />,
      onClick: () => navigate('/help-center'),
      tooltip: 'Help Center',
    },
    // Events Calendar
    {
      icon: <Calendar className='h-5 w-5' />,
      onClick: () => navigate('/events-calendar'),
      tooltip: 'Events',
    },
    // Achievements
    {
      icon: <Award className='h-5 w-5' />,
      onClick: () => navigate('/achievements'),
      tooltip: 'Achievements',
    },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className='absolute top-28 right-0 z-[10001] flex flex-col gap-2 transform -translate-x-[100%] pointer-events-auto'
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
              <div className='relative group pointer-events-auto'>
                <GameButton
                  icon={item.icon}
                  onClick={item.onClick}
                  className='w-12 h-12 rounded-xl bg-blue-500/30 hover:bg-blue-500/50 backdrop-blur-sm text-white border border-blue-400/40 shadow-lg hover:shadow-blue-400/30 transition-all duration-200 hover:scale-105 pointer-events-auto'
                />
                {item.tooltip && (
                  <div className='absolute -left-32 top-1/2 transform -translate-y-1/2 w-24 bg-blue-600/90 backdrop-blur-md rounded-lg p-2 border border-blue-400/50 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[10002] pointer-events-none'>
                    <div className='absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600/90 transform rotate-45 border-r border-b border-blue-400/50'></div>
                    <span className='text-white text-xs font-medium text-center block'>
                      {item.tooltip}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
