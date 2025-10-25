import { useSSEContext } from '@/contexts/SSEContext';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

export function SSEStatus() {
  const { isConnected, isConnecting, error } = useSSEContext();

  if (isConnecting) {
    return (
      <div className='flex items-center gap-2 text-blue-500 text-sm'>
        <Loader2 className='w-4 h-4 animate-spin' />
        <span>Connecting to real-time updates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center gap-2 text-red-500 text-sm'>
        <WifiOff className='w-4 h-4' />
        <span>Connection error: {error}</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className='flex items-center gap-2 text-green-500 text-sm'>
        <Wifi className='w-4 h-4' />
        <span>Real-time updates active</span>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2 text-gray-500 text-sm'>
      <WifiOff className='w-4 h-4' />
      <span>Real-time updates offline</span>
    </div>
  );
}
