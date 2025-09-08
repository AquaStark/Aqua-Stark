'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { FishTank } from '@/components/fish-tank';

interface Fish {
  id: number;
  name: string;
  image: string;
  description: string;
  color: string;
}

interface FishCardProps {
  fish: Fish;
  isSelected?: boolean;
  onSelect?: () => void;
  variant?: 'onboarding' | 'default';
}

export function FishCard({
  fish,
  isSelected = false,
  onSelect,
  variant = 'default',
}: FishCardProps) {
  if (variant === 'onboarding') {
    return (
      <motion.div
        className={`relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 cursor-pointer overflow-hidden transition-all duration-300 shadow-md ${
          isSelected
            ? 'ring-2 ring-blue-300 scale-[1.02]'
            : 'hover:scale-[1.015]'
        }`}
        whileHover={{ scale: isSelected ? 1.02 : 1.015 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSelect}
      >
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className='absolute top-2 right-2 bg-blue-500 rounded-full p-1 z-20'
          >
            <Check className='w-4 h-4 text-white' />
          </motion.div>
        )}

        <div className='p-4 text-center'>
          <h3 className='text-lg font-bold text-white mb-4 uppercase tracking-wide'>
            {fish.name}
          </h3>

          <div className='relative w-40 h-40 mx-auto mb-4'>
            <FishTank className='w-full h-full' shadow={false}>
              <div className='relative w-full h-full flex items-center justify-center'>
                <img
                  src={fish.image}
                  alt={fish.name}
                  className='w-24 h-24 object-contain'
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                />
              </div>
            </FishTank>
          </div>

          <p className='text-sm text-white/80 leading-relaxed'>
            {fish.description}
          </p>
        </div>

        <motion.div
          className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300'
          initial={false}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className='relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 shadow-md hover:scale-[1.015]'
      whileHover={{ scale: 1.015 }}
      onClick={onSelect}
    >
      <div className='p-4 text-center'>
        <h3 className='text-lg font-bold text-white mb-4 uppercase tracking-wide'>
          {fish.name}
        </h3>

        <div className='relative w-40 h-40 mx-auto mb-4'>
          <FishTank className='w-full h-full' shadow={false}>
            <div className='relative w-full h-full flex items-center justify-center'>
              <img
                src={fish.image}
                alt={fish.name}
                className='w-24 h-24 object-contain'
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              />
            </div>
          </FishTank>
        </div>

        <p className='text-sm text-white/80 leading-relaxed'>
          {fish.description}
        </p>
      </div>

      <motion.div
        className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300'
        initial={false}
      />
    </motion.div>
  );
}
