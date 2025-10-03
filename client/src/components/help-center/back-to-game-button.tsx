import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BackToGameButton() {
  return (
    <Link to={'/game'}>
      <button
        className='flex items-center text-white hover:text-blue-200 transition-colors'
        aria-label='Navigate back to game'
      >
        <ArrowLeft className='h-5 w-5 mr-1' aria-hidden='true' />
        <span>Back to Game</span>
      </button>
    </Link>
  );
}
