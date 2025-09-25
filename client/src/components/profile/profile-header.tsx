import { ArrowLeft, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  currency: number;
}

export function ProfileHeader({ currency }: ProfileHeaderProps) {
  return (
    <header
      className='flex items-center justify-between mb-6 animate-fadeDown'
      style={{ animationDelay: '0.1s' }}
    >
      <Button
        asChild
        variant='link'
        className='text-white text-lg font-bold group hover:text-blue-200 transition-colors'
      >
        <Link to='/game' className='flex items-center'>
          <ArrowLeft className='mr-2 group-hover:-translate-x-1 transition-transform' />
          Back to Game
        </Link>
      </Button>

      <h1 className='text-2xl font-bold'>My Profile</h1>

      <div className='flex items-center'>
        <Coins className='w-5 h-5 mr-2 text-yellow-400 animate-pulse-slow' />
        <span className='font-bold'>{currency.toLocaleString()}</span>
      </div>
    </header>
  );
}
