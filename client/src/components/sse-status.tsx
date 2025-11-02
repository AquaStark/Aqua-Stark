import { useSSEContext } from '@/contexts/SSEContext';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

export function SSEStatus() {
  const { isConnected, isConnecting, error } = useSSEContext();

  if (isConnecting) {
    return (
      <div className='flex items-center gap-1 text-blue-500 text-xs'>
        <Loader2 className='w-3 h-3 animate-spin' />
        <span>Connecting...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center gap-1 text-red-500 text-xs'>
        <WifiOff className='w-3 h-3' />
        <span>Offline</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className='flex items-center gap-1 text-green-500 text-xs'>
        <Wifi className='w-3 h-3' />
        <span>Live</span>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-1 text-gray-500 text-xs'>
      <WifiOff className='w-3 h-3' />
      <span>Offline</span>
    </div>
  );
}
