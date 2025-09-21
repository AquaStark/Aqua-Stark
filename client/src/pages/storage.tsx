'use client';

import { StoreOriginal } from '@/components';
import { BubblesBackground } from '@/components';
import { useBubbles } from '@/hooks';
import { PageHeader } from '@/components';
import { LayoutFooter } from '@/components';
import { CartSidebar } from '@/components';
import { CheckoutModal } from '@/component';
import { useCartStore } from '@/store/use-cart-store';
import { Button } from '@/components';
import { ShoppingCart } from 'lucide-react';

export default function StorePage() {
  const bubbles = useBubbles();
  const { toggleCart } = useCartStore();

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900 animated-background'>
      <BubblesBackground bubbles={bubbles} />

      <PageHeader
        title='Aqua Stark Store'
        backTo='/'
        rightContent={
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              className='relative text-white rounded-full hover:bg-blue-500/50'
              onClick={toggleCart}
            >
              <ShoppingCart className='mr-2' />
            </Button>
            <div className='flex items-center px-4 py-2 border rounded-full bg-blue-700/50 border-blue-400/50'>
              <img src='/icons/coin.png' alt='Coins' className='w-5 h-5 mr-2' />
              <span className='font-bold text-white'>12,500</span>
            </div>
          </div>
        }
      />
      <CartSidebar />
      <CheckoutModal />

      <main className='relative z-10'>
        <div className='px-2 sm:px-4 py-2 sm:py-4 mx-auto max-w-6xl'>
          <StoreOriginal />
        </div>
      </main>

      <LayoutFooter />
    </div>
  );
}
