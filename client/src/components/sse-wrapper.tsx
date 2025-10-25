import React from 'react';
import { useAccount } from '@starknet-react/core';
import { SSEProvider } from '@/contexts/SSEContext';

interface SSEWrapperProps {
  children: React.ReactNode;
}

export function SSEWrapper({ children }: SSEWrapperProps) {
  const { account } = useAccount();

  // Only provide SSE context if we have a connected account
  if (!account?.address) {
    return <>{children}</>;
  }

  return <SSEProvider playerWallet={account.address}>{children}</SSEProvider>;
}
