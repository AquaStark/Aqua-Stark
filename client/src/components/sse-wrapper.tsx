import React from 'react';
import { useAccount } from '@starknet-react/core';
import { SSEProvider } from '@/contexts/SSEContext';
import { ENV_CONFIG } from '@/config/environment';

interface SSEWrapperProps {
  children: React.ReactNode;
}

export function SSEWrapper({ children }: SSEWrapperProps) {
  const { account } = useAccount();

  // Only provide SSE context if real-time updates are enabled
  // This prevents SSE from trying to connect when backend is not available
  if (!ENV_CONFIG.FEATURES.REALTIME_UPDATES) {
    // Return children without SSE provider to completely disable SSE
    return <>{children}</>;
  }

  // Always provide SSE context, but with conditional wallet
  return (
    <SSEProvider playerWallet={account?.address || ''}>{children}</SSEProvider>
  );
}
