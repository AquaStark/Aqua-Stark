import {
  createContext,
  useContext,
  useCallback,
  useState,
  ReactNode,
} from 'react';
import { useSSE } from '@/hooks/use-sse';

interface SSEContextType {
  isConnected: boolean;
  isConnecting: boolean;
  lastEvent: any;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  // Event handlers
  onFishUpdate: (data: any) => void;
  onAquariumUpdate: (data: any) => void;
  onGameEvent: (data: any) => void;
  // Event history
  eventHistory: any[];
  clearHistory: () => void;
}

const SSEContext = createContext<SSEContextType | undefined>(undefined);

interface SSEProviderProps {
  children: ReactNode;
  playerWallet: string;
}

export function SSEProvider({ children, playerWallet }: SSEProviderProps) {
  const [eventHistory, setEventHistory] = useState<any[]>([]);
  const [fishUpdateHandler, setFishUpdateHandler] = useState<
    (data: any) => void
  >(() => {});
  const [aquariumUpdateHandler, setAquariumUpdateHandler] = useState<
    (data: any) => void
  >(() => {});
  const [gameEventHandler, setGameEventHandler] = useState<(data: any) => void>(
    () => {}
  );

  // If no wallet, provide a disabled context
  if (!playerWallet) {
    const disabledContext: SSEContextType = {
      isConnected: false,
      isConnecting: false,
      lastEvent: null,
      error: 'No wallet connected',
      connect: () => {},
      disconnect: () => {},
      onFishUpdate: () => {},
      onAquariumUpdate: () => {},
      onGameEvent: () => {},
      eventHistory: [],
      clearHistory: () => {},
    };

    return (
      <SSEContext.Provider value={disabledContext}>
        {children}
      </SSEContext.Provider>
    );
  }

  // Add event to history
  const addToHistory = useCallback((event: any) => {
    setEventHistory(prev => {
      const newHistory = [...prev, { ...event, timestamp: Date.now() }];
      // Keep only last 50 events
      return newHistory.slice(-50);
    });
  }, []);

  // Fish update handler
  const handleFishUpdate = useCallback(
    (data: any) => {
      console.log('🐟 Fish update received:', data);
      addToHistory({ type: 'fish_update', data });
      fishUpdateHandler(data);
    },
    [fishUpdateHandler, addToHistory]
  );

  // Aquarium update handler
  const handleAquariumUpdate = useCallback(
    (data: any) => {
      console.log('🏠 Aquarium update received:', data);
      addToHistory({ type: 'aquarium_update', data });
      aquariumUpdateHandler(data);
    },
    [aquariumUpdateHandler, addToHistory]
  );

  // Game event handler
  const handleGameEvent = useCallback(
    (data: any) => {
      console.log('🎮 Game event received:', data);
      addToHistory({ type: 'game_event', data });
      gameEventHandler(data);
    },
    [gameEventHandler, addToHistory]
  );

  // Connection change handler
  const handleConnectionChange = useCallback(
    (connected: boolean) => {
      console.log(
        '🌊 SSE Connection status:',
        connected ? 'Connected' : 'Disconnected'
      );
      if (connected) {
        addToHistory({
          type: 'connection',
          message: 'Connected to real-time updates',
        });
      }
    },
    [addToHistory]
  );

  // Use SSE hook
  const sse = useSSE({
    playerWallet,
    onFishUpdate: handleFishUpdate,
    onAquariumUpdate: handleAquariumUpdate,
    onGameEvent: handleGameEvent,
    onConnectionChange: handleConnectionChange,
    autoReconnect: true,
    reconnectInterval: 5000,
  });

  // Clear event history
  const clearHistory = useCallback(() => {
    setEventHistory([]);
  }, []);

  // Register event handlers
  const registerFishUpdateHandler = useCallback(
    (handler: (data: any) => void) => {
      setFishUpdateHandler(() => handler);
    },
    []
  );

  const registerAquariumUpdateHandler = useCallback(
    (handler: (data: any) => void) => {
      setAquariumUpdateHandler(() => handler);
    },
    []
  );

  const registerGameEventHandler = useCallback(
    (handler: (data: any) => void) => {
      setGameEventHandler(() => handler);
    },
    []
  );

  const contextValue: SSEContextType = {
    ...sse,
    onFishUpdate: registerFishUpdateHandler,
    onAquariumUpdate: registerAquariumUpdateHandler,
    onGameEvent: registerGameEventHandler,
    eventHistory,
    clearHistory,
  };

  return (
    <SSEContext.Provider value={contextValue}>{children}</SSEContext.Provider>
  );
}

// Hook to use SSE context
export function useSSEContext() {
  const context = useContext(SSEContext);
  if (context === undefined) {
    throw new Error('useSSEContext must be used within an SSEProvider');
  }
  return context;
}

// Hook for fish updates specifically
export function useFishUpdates() {
  const { onFishUpdate, isConnected, error } = useSSEContext();

  const subscribeToFishUpdates = useCallback(
    (handler: (data: any) => void) => {
      onFishUpdate(handler);
    },
    [onFishUpdate]
  );

  return {
    subscribeToFishUpdates,
    isConnected,
    error,
  };
}

// Hook for aquarium updates specifically
export function useAquariumUpdates() {
  const { onAquariumUpdate, isConnected, error } = useSSEContext();

  const subscribeToAquariumUpdates = useCallback(
    (handler: (data: any) => void) => {
      onAquariumUpdate(handler);
    },
    [onAquariumUpdate]
  );

  return {
    subscribeToAquariumUpdates,
    isConnected,
    error,
  };
}

// Hook for game events specifically
export function useGameEvents() {
  const { onGameEvent, isConnected, error } = useSSEContext();

  const subscribeToGameEvents = useCallback(
    (handler: (data: any) => void) => {
      onGameEvent(handler);
    },
    [onGameEvent]
  );

  return {
    subscribeToGameEvents,
    isConnected,
    error,
  };
}
