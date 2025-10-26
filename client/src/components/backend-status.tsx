import React from 'react';
import { ENV_CONFIG, isLocalBackend, getBackendType, logEnvironmentConfig } from '@/config/environment';
import { Server, Globe, Wifi, WifiOff } from 'lucide-react';

interface BackendStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function BackendStatus({ showDetails = false, className = '' }: BackendStatusProps) {
  const isLocal = isLocalBackend();
  const backendType = getBackendType();
  
  // Log configuration on mount (only in debug mode)
  React.useEffect(() => {
    logEnvironmentConfig();
  }, []);

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-1 text-xs ${className}`}>
        {isLocal ? (
          <Server className="w-3 h-3 text-blue-500" />
        ) : (
          <Globe className="w-3 h-3 text-green-500" />
        )}
        <span className={isLocal ? 'text-blue-500' : 'text-green-500'}>
          {backendType}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 text-xs ${className}`}>
      <div className="flex items-center gap-1">
        {isLocal ? (
          <Server className="w-3 h-3 text-blue-500" />
        ) : (
          <Globe className="w-3 h-3 text-green-500" />
        )}
        <span className={isLocal ? 'text-blue-500' : 'text-green-500'}>
          Backend: {backendType}
        </span>
      </div>
      <div className="text-gray-500 text-[10px] truncate max-w-[120px]">
        {ENV_CONFIG.API_URL}
      </div>
    </div>
  );
}

// Component to show connection status
export function BackendConnectionStatus({ 
  isConnected, 
  isConnecting, 
  error 
}: { 
  isConnected: boolean; 
  isConnecting: boolean; 
  error: string | null; 
}) {
  if (isConnecting) {
    return (
      <div className="flex items-center gap-1 text-xs text-yellow-500">
        <Wifi className="w-3 h-3 animate-pulse" />
        <span>Connecting...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-1 text-xs text-red-500">
        <WifiOff className="w-3 h-3" />
        <span>Error</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-1 text-xs text-green-500">
        <Wifi className="w-3 h-3" />
        <span>Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <WifiOff className="w-3 h-3" />
      <span>Offline</span>
    </div>
  );
}
