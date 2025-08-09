'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter, Lock, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FishTank } from '@/components/fish-tank';
import EncyclopediaFilters from './encyclopedia-filters';
import type { EncyclopediaFilters as EncyclopediaFiltersState } from '@/hooks/use-encyclopedia';
import type { FishSpecies } from '@/data/encyclopedia-data';

type SortOption = 'name' | 'rarity' | 'recent';

interface EncyclopediaCatalogProps {
  filters: EncyclopediaFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<EncyclopediaFiltersState>>;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  sortedFish: FishSpecies[];
  handleFishClick: (fish: FishSpecies) => void;
  resetFilters: () => void;
}

export default function EncyclopediaCatalog({
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  sortedFish,
  handleFishClick,
  resetFilters,
}: EncyclopediaCatalogProps) {
  return (
    <>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div className='flex-1 w-full md:w-auto'>
          <div className='relative'>
            <Input
              type='text'
              placeholder='Search by name or scientific name...'
              className='bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300/70 pr-8 w-full'
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
            <Search className='absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300/70' />
          </div>
        </div>
        <div className='flex gap-2 w-full md:w-auto'>
          <Button
            variant='outline'
            className='bg-blue-800/50 border-blue-700/50 text-white flex-1 md:flex-none'
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls='filters-panel'
          >
            <Filter className='h-4 w-4 mr-2' aria-hidden='true' />
            Filters
            {showFilters ? (
              <ChevronUp className='ml-2 h-4 w-4' aria-hidden='true' />
            ) : (
              <ChevronDown className='ml-2 h-4 w-4' aria-hidden='true' />
            )}
          </Button>
          <select
            className='bg-blue-800/50 border border-blue-700/50 text-white rounded-md px-3 py-2 flex-1 md:flex-none'
            value={filters.sort}
            onChange={e =>
              setFilters({ ...filters, sort: e.target.value as SortOption })
            }
          >
            <option value='name'>Sort by Name</option>
            <option value='rarity'>Sort by Rarity</option>
            <option value='recent'>Sort by Recent</option>
          </select>
        </div>
      </div>
      <EncyclopediaFilters
        showFilters={showFilters}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />
      <div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
        role='grid'
        aria-label='Fish catalog'
      >
        {sortedFish.length > 0 ? (
          sortedFish.map((fish, index) => (
            <motion.div
              key={fish.id}
              role='gridcell'
              tabIndex={0}
              className={cn(
                'bg-blue-800/50 backdrop-blur-sm rounded-xl border overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-900',
                fish.discovered ? 'border-blue-700/50' : 'border-gray-700/50'
              )}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              onClick={() => handleFishClick(fish)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleFishClick(fish);
                }
                // Grid navigation
                const gridCells =
                  document.querySelectorAll('[role="gridcell"]');
                const currentIndex = Array.from(gridCells).indexOf(
                  e.currentTarget
                );
                const colCount =
                  window.innerWidth >= 1024
                    ? 3
                    : window.innerWidth >= 768
                      ? 2
                      : 1;
                let nextIndex;

                switch (e.key) {
                  case 'ArrowRight':
                    nextIndex = currentIndex + 1;
                    break;
                  case 'ArrowLeft':
                    nextIndex = currentIndex - 1;
                    break;
                  case 'ArrowDown':
                    nextIndex = currentIndex + colCount;
                    break;
                  case 'ArrowUp':
                    nextIndex = currentIndex - colCount;
                    break;
                  case 'Home':
                    nextIndex = 0;
                    break;
                  case 'End':
                    nextIndex = gridCells.length - 1;
                    break;
                  default:
                    return;
                }

                if (nextIndex >= 0 && nextIndex < gridCells.length) {
                  e.preventDefault();
                  (gridCells[nextIndex] as HTMLElement).focus();
                }
              }}
              aria-label={`${fish.discovered ? fish.name : 'Unknown Species'}, ${fish.discovered ? fish.rarity + ' rarity' : 'Undiscovered'}`}
            >
              <div className='relative h-40 bg-blue-900/50'>
                {fish.discovered ? (
                  <FishTank className='h-40'>
                    <img
                      src={fish.image || '/placeholder.svg'}
                      alt=''
                      width={100}
                      height={100}
                      className='object-contain'
                      aria-hidden='true'
                    />
                  </FishTank>
                ) : (
                  <div
                    className='absolute inset-0 flex items-center justify-center'
                    aria-hidden='true'
                  >
                    <Lock className='h-16 w-16 text-gray-500/50' />
                  </div>
                )}
                <div
                  className={cn(
                    'absolute top-2 right-2 px-2 py-1 rounded-full text-xs text-white',
                    fish.rarity === 'Common'
                      ? 'bg-gray-500/80'
                      : fish.rarity === 'Uncommon'
                        ? 'bg-green-500/80'
                        : fish.rarity === 'Rare'
                          ? 'bg-blue-500/80'
                          : fish.rarity === 'Epic'
                            ? 'bg-purple-500/80'
                            : 'bg-amber-500/80'
                  )}
                  aria-hidden='true'
                >
                  {fish.rarity}
                </div>
              </div>
              <div className='p-4'>
                <h3 className='font-bold text-white sr-only'>
                  {fish.discovered ? fish.name : 'Unknown Species'}
                </h3>
                {fish.discovered ? (
                  <p className='text-blue-300 text-sm italic sr-only'>
                    {fish.scientificName}
                  </p>
                ) : (
                  <p className='text-blue-300 text-sm italic sr-only'>
                    This species has not been discovered yet.
                  </p>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className='col-span-full bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 p-8 text-center'>
            <div className='w-16 h-16 rounded-full bg-blue-700/50 flex items-center justify-center mx-auto mb-4'>
              <Search className='h-8 w-8 text-blue-300' />
            </div>
            <h3 className='text-xl font-bold text-white mb-2'>No fish found</h3>
            <p className='text-blue-200 mb-4'>
              Try adjusting your filters or search criteria
            </p>
            <Button
              variant='outline'
              className='border-blue-600/50 text-blue-100 hover:bg-blue-700/50'
              onClick={resetFilters}
            >
              <X className='h-4 w-4 mr-2' />
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
