import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function LayoutFooter({ className }: FooterProps = {}) {
  return (
    <footer
      className={cn(
        'relative z-40 bg-blue-800/95 backdrop-blur-sm py-2 sm:py-4 md:py-6 border-t-2 border-blue-400/50',
        className
      )}
    >
      <div className='container mx-auto px-2 sm:px-4 text-center'>
        <p className='text-white/80 mb-1 sm:mb-2 text-xs sm:text-sm'>
          © 2025 Aqua Stark - All rights reserved
        </p>
        <div className='flex justify-center gap-1 sm:gap-4 mt-1 sm:mt-4'>
          <Link
            to='#'
            className='text-white hover:text-blue-200 transition-colors text-xs sm:text-sm'
          >
            Privacy
          </Link>
          <Link
            to='#'
            className='text-white hover:text-blue-200 transition-colors text-xs sm:text-sm'
          >
            Terms
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
