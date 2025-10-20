import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function LayoutFooter({ className }: FooterProps = {}) {
  return (
    <footer
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-blue-800/95 backdrop-blur-sm py-3 sm:py-4 md:py-6 border-t-2 border-blue-400/50',
        className
      )}
    >
      <div className='container mx-auto px-4 text-center'>
        <p className='text-white/80 mb-1 sm:mb-2 text-xs sm:text-sm'>
          © 2025 Aqua Stark - All rights reserved
        </p>
        <div className='flex justify-center gap-2 sm:gap-4 mt-2 sm:mt-4'>
          <Link
            to='#'
            className='text-white hover:text-blue-200 transition-colors text-xs sm:text-sm'
          >
            Privacy Policy
          </Link>
          <Link
            to='#'
            className='text-white hover:text-blue-200 transition-colors text-xs sm:text-sm'
          >
            Terms of Service
          </Link>
          <Link
            to='#'
            className='text-white hover:text-blue-200 transition-colors text-xs sm:text-sm'
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
