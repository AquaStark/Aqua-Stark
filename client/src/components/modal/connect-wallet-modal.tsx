'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectWalletModal({
  isOpen,
  onClose,
}: ConnectWalletModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50'
          />

          {/* Modal */}
          <div className='fixed inset-0 flex items-center justify-center z-50 pointer-events-none'>
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.6 }}
              className='bg-blue-900/95 backdrop-blur-xl rounded-2xl px-8 py-10 border-2 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.3)] max-w-md w-full mx-4 pointer-events-auto relative'
            >
              {/* Close button */}
              <Button
                onClick={onClose}
                variant='ghost'
                size='sm'
                className='absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10'
              >
                <X className='w-5 h-5' />
              </Button>

              {/* Animated fish icon */}
              <div className='flex justify-center mb-6'>
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className='w-24 h-24'
                >
                  <img
                    src='/fish/fish1.png'
                    alt='Fish'
                    className='w-full h-full object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                  />
                </motion.div>
              </div>

              {/* Title */}
              <h2 className='text-3xl md:text-4xl font-extrabold text-white text-center mb-6 drop-shadow-lg'>
                Connect Your Wallet
              </h2>

              {/* Message */}
              <p className='text-cyan-100 text-center mb-8 text-lg font-medium'>
                Click the button above! 👆
              </p>

              {/* Close button */}
              <div className='flex justify-center'>
                <button
                  onClick={onClose}
                  className='text-cyan-200/80 hover:text-white text-sm transition-colors px-6 py-2 hover:bg-white/10 rounded-lg'
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
