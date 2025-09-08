import { motion } from 'framer-motion';
import { useCartStore } from '@/store/use-cart-store';

interface BundleItemProps {
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
}

export default function BundleItem({
  id,
  name,
  image,
  price,
  originalPrice,
  discount,
  rarity,
  items,
}: BundleItemProps) {
  const { addItem, addToRecentlyViewed } = useCartStore();

  const handleAddToCart = () => {
    const item = {
      id,
      name,
      image,
      price,
      rarity,
    };
    addItem(item);
    addToRecentlyViewed(item);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className='bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg overflow-hidden shadow-lg border border-blue-400/30 transform transition-all duration-200 relative p-3'
    >
      <div className='flex flex-col md:flex-row'>
        {/* Content section */}
        <div className='flex-grow'>
          <h3 className='text-sm font-bold text-white mb-2'>{name}</h3>
          <div className='text-xs text-blue-100 mb-1'>
            Includes: {items.join(', ')}
          </div>

          <div className='flex items-center mt-2'>
            <span className='text-white font-bold text-sm flex items-center'>
              <img src='/icons/coin.png' alt='Coins' className='w-3 h-3 mr-1' />
              {price}
            </span>
            <span className='text-xs text-gray-300 line-through ml-2 mr-2 flex items-center'>
              <img src='/icons/coin.png' alt='Coins' className='w-3 h-3 mr-1' />
              {originalPrice}
            </span>
            <span className='bg-green-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full'>
              {discount}
            </span>
          </div>
        </div>

        {/* Image section */}
        <div className='flex items-center justify-center md:justify-end mt-2 md:mt-0'>
          <div className='relative w-16 h-16 md:mr-2'>
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className='object-contain h-full transform hover:scale-110 transition-all duration-500'
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className='bg-yellow-500 hover:bg-yellow-600 text-xs text-white font-bold w-full p-1.5 rounded-md'
          >
            Buy Bundle
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
