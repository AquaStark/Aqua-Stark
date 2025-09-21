import { motion } from 'framer-motion';
import { BundleItem } from '@/components';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface BundleGridProps {
  bundles: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice: number;
    discount: string;
    tag: string;
    rarity: string;
    items: string[];
    description: string;
  }>;
}

export function BundleGrid({ bundles }: BundleGridProps) {
  const [currentPage, setCurrentPage] = useState(0);

  if (bundles.length === 0) {
    return (
      <div className='text-center py-8 text-blue-200'>
        No bundles available at this time.
      </div>
    );
  }

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
    <div className='mb-4'>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='mb-3'
      >
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-bold text-white flex items-center'>
            <Package className='mr-2 text-yellow-400' size={16} /> Special
            Bundles
          </h2>

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
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        {currentBundles.map(bundle => (
          <BundleItem
            key={bundle.id}
            id={bundle.id}
            name={bundle.name}
            image={bundle.image}
            price={bundle.price}
            originalPrice={bundle.originalPrice}
            discount={bundle.discount}
            tag={bundle.tag}
            rarity={bundle.rarity}
            items={bundle.items}
            description={bundle.description}
          />
        ))}
      </div>
    </div>
  );
}
