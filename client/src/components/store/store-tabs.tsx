import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemType } from '@/data/mock-game';

interface StoreTabsProps {
  activeTab: ItemType;
  onTabChange: (tab: ItemType) => void;
}

export function StoreTabs({ activeTab, onTabChange }: StoreTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={value => onTabChange(value as ItemType)}
      className='w-full'
    >
      <TabsList className='flex items-center justify-start w-full gap-0.5 p-0 bg-transparent md:w-fit'>
        <TabsTrigger
          value='fish'
          className='font-bold rounded-none rounded-tl-3xl py-4 md:py-3 md:pl-6 md:pr-4 md:rounded-none text-white uppercase data-[state=active]:bg-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-b-orange-500 data-[state=inactive]:border-none data-[state=active]:text-white data-[state=inactive]:text-white'
          role='tab'
          aria-controls='fish-panel'
          aria-selected={activeTab === 'fish'}
        >
          Fish
        </TabsTrigger>
        <TabsTrigger
          value='food'
          className='font-bold rounded-none py-4 md:py-3 md:px-4 md:rounded-none text-white uppercase data-[state=active]:bg-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-b-orange-500 data-[state=inactive]:border-none data-[state=active]:text-white data-[state=inactive]:text-white'
          role='tab'
          aria-controls='food-panel'
          aria-selected={activeTab === 'food'}
        >
          Food
        </TabsTrigger>
        <TabsTrigger
          value='decorations'
          className='font-bold rounded-none py-4 md:py-3 md:px-4 md:rounded-none text-white uppercase data-[state=active]:bg-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-b-orange-500 data-[state=inactive]:border-none data-[state=active]:text-white data-[state=inactive]:text-white'
          role='tab'
          aria-controls='decorations-panel'
          aria-selected={activeTab === 'decorations'}
        >
          Decorations
        </TabsTrigger>
        <TabsTrigger
          value='others'
          className='font-bold rounded-none rounded-tr-3xl py-4 md:py-3 md:px-4 md:rounded-none text-white uppercase data-[state=active]:bg-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-b-orange-500 data-[state=inactive]:border-none data-[state=active]:text-white data-[state=inactive]:text-white'
          role='tab'
          aria-controls='others-panel'
          aria-selected={activeTab === 'others'}
        >
          Others
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
