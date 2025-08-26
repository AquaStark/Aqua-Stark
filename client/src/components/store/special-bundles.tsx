import { StoreBundle } from './store-bundle';
import { CartItem, useCartStore } from '@/store/use-cart-store';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SpecialBundle } from '@/data/mock-store';
import { useState } from 'react';

interface SpecialBundlesProps {
  bundles: SpecialBundle[];
}

export function SpecialBundles({ bundles }: SpecialBundlesProps) {
  const { addItem, addToRecentlyViewed } = useCartStore();
  const [currentPage, setCurrentPage] = useState(0);

  const handleBuyBundle = (bundle: SpecialBundle) => {
    const { id, name, image, price } = bundle;

    // Create item object for cart
    const item: CartItem = { id, name, image, price, quantity: 1 };

    setTimeout(() => {
      addItem(item);
      addToRecentlyViewed(item);
    }, 300);
  };

  const itemsPerPage = 2;
  const totalPages = Math.ceil(bundles.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBundles = bundles.slice(startIndex, endIndex);

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className='mb-4'
    >
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <Package size={14} className='text-yellow-500' />
          <h2 className='text-lg font-bold text-white'>Special Bundles</h2>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className='flex items-center gap-2'>
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className='p-1 rounded-md bg-blue-700/50 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ChevronLeft size={16} className='text-white' />
            </button>
            <span className='text-sm text-white'>
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className='p-1 rounded-md bg-blue-700/50 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ChevronRight size={16} className='text-white' />
            </button>
          </div>
        )}
      </div>

      <div className='grid grid-cols-1 gap-3 lg:grid-cols-2'>
        {currentBundles.map(bundle => (
          <StoreBundle
            key={bundle.id}
            bundle={bundle}
            onBuy={handleBuyBundle}
          />
        ))}
      </div>
    </motion.div>
  );
}
