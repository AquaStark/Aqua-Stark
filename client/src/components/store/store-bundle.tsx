import { SpecialBundle } from '@/data/mock-store';

interface StoreBundleProps {
  bundle: SpecialBundle;
  onBuy: (bundle: SpecialBundle) => void;
}

const getBundleGradient = (bundleType?: string) => {
  switch (bundleType) {
    case 'decorations':
      return 'from-blue-700 to-green-700';
    case 'food':
      return 'from-blue-700 to-orange-700';
    default:
      return '';
  }
};

const savingsPercentage = (data: SpecialBundle) => {
  const priceDifference = data.originalPrice - data.price;
  const percentage = (priceDifference / data.originalPrice) * 100;
  return Math.round(percentage);
};

export function StoreBundle({ bundle, onBuy }: StoreBundleProps) {
  return (
    <div
      className={`flex flex-col p-3 mb-2 overflow-hidden rounded-md bg-gradient-to-r md:items-center md:flex-row ${getBundleGradient(
        bundle.type
      )}`}
    >
      <div className='flex flex-col flex-1'>
        <h3 className='text-sm font-bold text-white'>
          {bundle.name.toUpperCase()}
        </h3>
        <p className='mb-1 text-xs font-light text-blue-100'>
          Includes: {bundle.itemsDescription}
        </p>

        <div className='flex items-center gap-2 mt-auto'>
          <span className='text-xs text-gray-300 line-through flex items-center'>
            <img src='/icons/coin.png' alt='Coins' className='w-3 h-3 mr-1' />
            {bundle.originalPrice}
          </span>
          <span className='font-bold text-white flex items-center text-sm'>
            <img src='/icons/coin.png' alt='Coins' className='w-3 h-3 mr-1' />
            {bundle.price}
          </span>

          <div className='px-1.5 py-0.5 text-xs font-bold text-white bg-green-500 rounded-full shadow-md'>
            {savingsPercentage(bundle)}% SAVINGS
          </div>
        </div>
      </div>

      <img
        src={bundle.image}
        alt={bundle.name}
        className='hidden w-12 h-12 md:block'
      />

      <div className='flex items-center justify-center mt-2 md:ml-2 md:mt-0'>
        <button
          onClick={() => onBuy(bundle)}
          className='px-2 py-1 text-xs font-bold text-blue-100 rounded bg-yellow-500/90 hover:text-white hover:bg-yellow-600'
        >
          Buy Bundle
        </button>
      </div>
    </div>
  );
}
