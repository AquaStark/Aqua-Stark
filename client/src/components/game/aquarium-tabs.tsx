import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Utensils,
  Timer,
  ShoppingBag,
  Package,
  Gamepad2,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_AQUARIUMS } from '@/constants';
import { CleanButton } from '../dirt/clean-button';
import { TipsPopup } from './tips-popup';
import { useActiveAquarium } from '@/store/active-aquarium';
import { useAccount } from '@starknet-react/core';

interface AquariumTabProps {
  name: string;
  active: boolean;
  icon?: React.ReactNode;
  onClick: () => void;
}

function AquariumTab({ name, active, icon, onClick }: AquariumTabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'game-button px-2 sm:px-4 md:px-6 py-2 sm:py-3 rounded-t-xl font-bold transition-all duration-200 flex items-center text-xs sm:text-sm md:text-base',
        active
          ? 'bg-gradient-to-b from-blue-400 to-blue-600 text-white translate-y-0'
          : 'bg-blue-800/50 text-white/70 hover:bg-blue-700/50 translate-y-2'
      )}
      role='tab'
      aria-selected={active}
      aria-controls={`${name.toLowerCase()}-panel`}
    >
      {icon && (
        <span className='mr-1 sm:mr-2' aria-hidden='true'>
          {icon}
        </span>
      )}
      <span className='hidden sm:inline'>{name}</span>
      <span className='sm:hidden'>{name.split(' ')[0]}</span>
    </button>
  );
}

interface AquariumTabsProps {
  aquariums: typeof MOCK_AQUARIUMS;
  selectedAquarium: (typeof MOCK_AQUARIUMS)[0];
  onAquariumSelect: (aquarium?: (typeof MOCK_AQUARIUMS)[0]) => void;
  // Props para botones de acción
  feedingSystem?: {
    isFeeding: boolean;
    startFeeding: (duration: number) => void;
    stopFeeding: () => void;
  };
  dirtSystem?: {
    dirtLevel: number;
    isDirty: boolean;
    needsCleaning: boolean;
  };
  isCleaningMode?: boolean;
  onToggleCleaningMode?: () => void;
  showTips?: boolean;
  onTipsToggle?: () => void;
  onTipsClose?: () => void;
  realAquariumId?: string | null;
}

export function AquariumTabs({
  aquariums,
  selectedAquarium,
  onAquariumSelect,
  feedingSystem,
  dirtSystem,
  isCleaningMode,
  onToggleCleaningMode,
  showTips,
  onTipsToggle,
  onTipsClose,
  realAquariumId,
}: AquariumTabsProps) {
  const navigate = useNavigate();
  const { account } = useAccount();
  const { setActiveAquariumId, playerAddress: storedPlayerAddress } =
    useActiveAquarium();

  const handleViewAllClick = () => {
    // CRITICAL: Save REAL aquarium ID (not mock ID) before navigating
    const aquariumToSave = realAquariumId || selectedAquarium.id.toString();
    const playerAddress = account?.address || storedPlayerAddress;

    if (aquariumToSave && playerAddress) {
      console.log('💾 Saving REAL aquarium before navigation:', aquariumToSave);
      setActiveAquariumId(aquariumToSave, playerAddress);
    }
    navigate('/aquariums');
  };

  return (
    <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-transparent z-40 p-2 sm:p-4'>
      <div className='flex justify-between items-end gap-4'>
        {/* Left side - Aquarium tabs */}
        <div className='flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide'>
          {/* Show only the first aquarium */}
          {aquariums.slice(0, 1).map(aquarium => (
            <AquariumTab
              key={aquarium.id}
              name={aquarium.name}
              active={selectedAquarium === aquarium}
              onClick={() => onAquariumSelect(aquarium)}
            />
          ))}
          {/* View All button - redirects to /aquariums page */}
          <AquariumTab
            name='View All'
            active={false}
            icon={<Grid className='h-3 w-3 sm:h-4 sm:w-4' />}
            onClick={handleViewAllClick}
          />
        </div>

        {/* Right side - Action buttons */}
        <div className='flex items-center gap-2'>
          {/* Feed button */}
          {feedingSystem && (
            <div className='relative group'>
              <button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (feedingSystem.isFeeding) {
                    feedingSystem.stopFeeding();
                  } else {
                    feedingSystem.startFeeding(30000);
                  }
                }}
                className={`game-button bg-gradient-to-b text-white rounded-xl relative group cursor-pointer w-12 h-12 ${
                  feedingSystem.isFeeding
                    ? 'from-orange-400 to-orange-600'
                    : 'from-green-400 to-green-600'
                }`}
              >
                <div className='flex items-center justify-center gap-2 w-full h-full'>
                  {feedingSystem.isFeeding ? (
                    <Timer className='h-5 w-5' />
                  ) : (
                    <Utensils className='h-5 w-5' />
                  )}
                </div>
              </button>
              {/* Tooltip */}
              <div className='absolute bottom-16 left-1/2 transform -translate-x-1/2 w-20 bg-blue-600/90 backdrop-blur-md rounded-lg p-2 border border-blue-400/50 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-60'>
                <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600/90 transform rotate-45 border-r border-b border-blue-400/50'></div>
                <span className='text-white text-xs font-medium text-center block'>
                  Feed
                </span>
              </div>
            </div>
          )}

          {/* Clean Button */}
          {dirtSystem && onToggleCleaningMode && (
            <div className='relative group'>
              <CleanButton
                dirtLevel={dirtSystem.dirtLevel}
                isDirty={dirtSystem.isDirty}
                needsCleaning={dirtSystem.needsCleaning}
                onToggleCleaningMode={onToggleCleaningMode}
                isCleaningMode={isCleaningMode || false}
                className='w-12 h-12'
              />
            </div>
          )}

          {/* Other action buttons */}
          {[
            {
              id: 'shop',
              label: 'Shop',
              icon: <ShoppingBag className='h-5 w-5' />,
              color: 'from-blue-400 to-blue-600',
            },
            {
              id: 'collection',
              label: 'Collection',
              icon: <Package className='h-5 w-5' />,
              color: 'from-teal-400 to-teal-600',
            },
            {
              id: 'games',
              label: 'Games',
              icon: <Gamepad2 className='h-5 w-5' />,
              color: 'from-pink-400 to-pink-600',
            },
            {
              id: 'rewards',
              label: 'Rewards',
              icon: <Trophy className='h-5 w-5' />,
              color: 'from-yellow-400 to-yellow-600',
            },
          ].map(item => (
            <div key={item.id} className='relative group'>
              <button
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle different actions
                  switch (item.id) {
                    case 'shop':
                      navigate('/store');
                      break;
                    case 'collection':
                      break;
                    case 'games':
                      navigate('/mini-games');
                      break;
                    case 'rewards':
                      navigate('/achievements');
                      break;
                  }
                }}
                className={`game-button bg-gradient-to-b text-white rounded-xl relative group cursor-pointer w-12 h-12 ${item.color}`}
              >
                <div className='flex items-center justify-center gap-2 w-full h-full'>
                  {item.icon}
                </div>
              </button>
              {/* Tooltip */}
              <div className='absolute bottom-16 left-1/2 transform -translate-x-1/2 w-20 bg-blue-600/90 backdrop-blur-md rounded-lg p-2 border border-blue-400/50 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-60'>
                <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600/90 transform rotate-45 border-r border-b border-blue-400/50'></div>
                <span className='text-white text-xs font-medium text-center block'>
                  {item.label}
                </span>
              </div>
            </div>
          ))}

          {/* Tips button */}
          {onTipsToggle && onTipsClose && (
            <TipsPopup
              show={showTips || false}
              onClose={onTipsClose}
              onToggle={onTipsToggle}
            />
          )}
        </div>
      </div>
    </div>
  );
}
