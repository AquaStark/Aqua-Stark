import { useEffect, useRef, useState, useCallback } from 'react';

interface SSEEvent {
  type: string;
  data: any;
  timestamp: number;
  message?: string;
}

interface UseSSEOptions {
  playerWallet: string;
  onFishUpdate?: (data: any) => void;
  onAquariumUpdate?: (data: any) => void;
  onGameEvent?: (data: any) => void;
  onConnectionChange?: (connected: boolean) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export function useSSE({
  playerWallet,
  onFishUpdate,
  onAquariumUpdate,
  onGameEvent,
  onConnectionChange,
  autoReconnect = true,
  reconnectInterval = 5000,
}: UseSSEOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastEvent, setLastEvent] = useState<SSEEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  // Get API base URL from environment
  const getApiUrl = () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    return `${baseUrl}/api/v1/events/${playerWallet}`;
  };

  // Handle incoming SSE events
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data: SSEEvent = JSON.parse(event.data);
        setLastEvent(data);
        setError(null);

        // Route events to appropriate handlers
        switch (data.type) {
          case 'fish_update':
            onFishUpdate?.(data.data);
            break;
          case 'aquarium_update':
            onAquariumUpdate?.(data.data);
            break;
          case 'game_event':
            onGameEvent?.(data.data);
            break;
          case 'connection':
            console.log('🌊 SSE Connected:', data.message);
            break;
          case 'ping':
            // Keep-alive ping, no action needed
            break;
          default:
            console.log('🌊 Unknown SSE event:', data.type);
        }
      } catch (err) {
        console.error('🌊 Error parsing SSE message:', err);
        setError('Failed to parse server message');
      }
    },
    [onFishUpdate, onAquariumUpdate, onGameEvent]
  );

  // Disconnect from SSE
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    onConnectionChange?.(false);
  }, [onConnectionChange]);

  // Connect to SSE endpoint
  const connect = useCallback(() => {
    if (!playerWallet || playerWallet === '') {
      console.warn('🌊 No player wallet provided for SSE connection');
      setIsConnected(false);
      setIsConnecting(false);
      setError('No wallet connected');
      return;
    }

    // Clean up existing connection
    disconnect();

    setIsConnecting(true);
    setError(null);

    try {
      const eventSource = new EventSource(getApiUrl());
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('🌊 SSE Connection opened');
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttempts.current = 0;
        onConnectionChange?.(true);
      };

      eventSource.onmessage = handleMessage;
      eventSource.onerror = (event: Event) => {
        console.error('🌊 SSE Connection error:', event);
        setIsConnected(false);
        setError('Connection lost');

        if (autoReconnect && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(
            `🌊 Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setError('Max reconnection attempts reached');
        }
      };
    } catch (err) {
      console.error('🌊 Failed to create SSE connection:', err);
      setError('Failed to connect to server');
      setIsConnecting(false);
    }
  }, [
    playerWallet,
    handleMessage,
    onConnectionChange,
    disconnect,
    getApiUrl,
    autoReconnect,
    reconnectInterval,
  ]);

  // Auto-connect when playerWallet changes
  useEffect(() => {
    if (playerWallet && playerWallet !== '') {
      connect();
    } else {
      // If no wallet, ensure we're disconnected
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [playerWallet, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    lastEvent,
    error,
    connect,
    disconnect,
    reconnectAttempts: reconnectAttempts.current,
  };
}
