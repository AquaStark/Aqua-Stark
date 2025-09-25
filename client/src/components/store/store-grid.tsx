import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StoreItem from '@/components/store/store-item';
import { ShopItem } from '@/types/shop-types';

interface StoreGridProps {
  items: ShopItem[];
}

export function StoreGrid({ items }: StoreGridProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const previousItemsLength = useRef(items.length);

  // Ensure all items have the required fields
  const processedItems = items.map(item => ({
    ...item,
    description: item.description || '',
    rating: item.rating || 0,
    id: item.id || `item-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
  }));

  // Calculate pagination
  const totalPages = Math.ceil(processedItems.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = processedItems.slice(startIndex, endIndex);

  // Debug info
  console.log('StoreGrid Debug:', {
    totalItems: processedItems.length,
    itemsPerPage,
    totalPages,
    currentPage,
    startIndex,
    endIndex,
    currentItemsLength: currentItems.length,
  });

  // Reset to first page when items change (only if items actually change)
  useEffect(() => {
    // Only reset if the number of items actually changed and we're not on page 0
    if (
      processedItems.length !== previousItemsLength.current &&
      currentPage > 0
    ) {
      setCurrentPage(0);
    }
    previousItemsLength.current = processedItems.length;
  }, [processedItems.length, currentPage]);

  const handleNextPage = () => {
    console.log(
      'Next page clicked, current:',
      currentPage,
      'total:',
      totalPages
    );
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    console.log(
      'Prev page clicked, current:',
      currentPage,
      'total:',
      totalPages
    );
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleGoToPage = (page: number) => {
    console.log('Go to page clicked:', page);
    setCurrentPage(page);
  };

  if (processedItems.length === 0) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-white text-lg'>No items found</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Items Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {currentItems.map(item => (
          <StoreItem
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            price={item.price}
            rarity={item.rarity}
            description={item.description}
            rating={item.rating}
            originalPrice={item.originalPrice}
            isNew={item.isNew}
            stock={item.stock}
            isLimited={item.isLimited}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center space-x-6 py-4'>
          {/* Previous Button */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className='group flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 border-2 border-blue-400/30 text-white hover:from-blue-500 hover:to-blue-600 hover:border-blue-300/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105 disabled:hover:scale-100'
          >
            <ChevronLeft className='w-6 h-6 text-white group-hover:text-blue-100 transition-colors duration-200' />
          </button>

          {/* Page Numbers */}
          <div className='flex space-x-3'>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handleGoToPage(index)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:scale-110 ${
                  index === currentPage
                    ? 'bg-blue-500 text-white shadow-blue-500/50 scale-110 border-2 border-blue-300'
                    : 'bg-blue-700/80 text-blue-200 hover:bg-blue-600 hover:text-white shadow-blue-700/25 border-2 border-blue-600/50 hover:border-blue-500'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className='group flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 border-2 border-blue-400/30 text-white hover:from-blue-500 hover:to-blue-600 hover:border-blue-300/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105 disabled:hover:scale-100'
          >
            <ChevronRight className='w-6 h-6 text-white group-hover:text-blue-100 transition-colors duration-200' />
          </button>
        </div>
      )}

      {/* Page Info */}
      <div className='text-center text-blue-200 text-sm'>
        Showing {startIndex + 1}-{Math.min(endIndex, processedItems.length)} of{' '}
        {processedItems.length} items
        {totalPages > 1 && ` • Page ${currentPage + 1} of ${totalPages}`}
      </div>
    </div>
  );
}
