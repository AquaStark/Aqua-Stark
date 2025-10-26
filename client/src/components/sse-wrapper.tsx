import React from 'react';
import { useAccount } from '@starknet-react/core';
import { SSEProvider } from '@/contexts/SSEContext';

interface SSEWrapperProps {
  children: React.ReactNode;
}

export function SSEWrapper({ children }: SSEWrapperProps) {
  const { account } = useAccount();

  // Always provide SSE context, but with conditional wallet
  return (
    <SSEProvider playerWallet={account?.address || ''}>
      {children}
    </SSEProvider>
  );
}
