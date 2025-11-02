import { ItemType } from '@/data/mock-game';

interface StoreTabsProps {
  activeTab: ItemType;
  onTabChange: (tab: ItemType) => void;
}

export function StoreTabs({ activeTab, onTabChange }: StoreTabsProps) {
  return (
    <div className='flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8'>
      {(['fish', 'food', 'decorations', 'others'] as ItemType[]).map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`
            relative px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-bold text-xs sm:text-sm md:text-base uppercase transition-all duration-300 transform
            flex items-center justify-center min-h-[36px] sm:min-h-[40px] md:min-h-[44px]
            ${
              activeTab === tab
                ? 'bg-blue-500 text-white shadow-lg scale-105 border border-blue-300'
                : 'bg-blue-600/20 text-blue-200 hover:bg-blue-500/30 hover:text-white hover:scale-102 border border-blue-500/30'
            }
            hover:shadow-md
            active:scale-95
          `}
          role='tab'
          aria-selected={activeTab === tab}
        >
          <span className='relative z-10 drop-shadow-lg text-center leading-tight'>
            {tab === 'decorations'
              ? 'Decorations'
              : tab === 'others'
                ? 'Others'
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </span>
        </button>
      ))}
    </div>
  );
}
