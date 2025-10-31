import { useEffect, useRef, useState, useCallback } from 'react';
import { ENV_CONFIG } from '@/config/environment';

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

  // Get API base URL from centralized environment config
  const getApiUrl = () => {
    return `${ENV_CONFIG.API_URL}/v1/events/${playerWallet}`;
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
            // Connection established silently
            break;
          case 'ping':
            // Keep-alive ping, no action needed
            break;
          default:
            // Unknown event type, ignore silently
        }
      } catch (err) {
        // Silently handle parse errors
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
    // Check if real-time updates are enabled
    if (!ENV_CONFIG.FEATURES.REALTIME_UPDATES) {
      // Silently disable SSE if feature is disabled
      setIsConnected(false);
      setIsConnecting(false);
      return;
    }

    if (!playerWallet || playerWallet === '') {
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
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttempts.current = 0;
        onConnectionChange?.(true);
      };

      eventSource.onmessage = handleMessage;
      eventSource.onerror = (event: Event) => {
        // Silently handle connection errors without showing 404s
        setIsConnected(false);
        
        // Stop reconnection attempts immediately to prevent 404 errors
        // If connection fails (like 404), don't retry
        if (eventSource.readyState === EventSource.CLOSED) {
          // Connection closed, likely 404 or server unavailable
          // Disconnect and stop trying to prevent repeated 404 errors
          disconnect();
          return;
        }

        // Only attempt reconnection if connection is still open but errored
        if (autoReconnect && reconnectAttempts.current < maxReconnectAttempts && eventSource.readyState === EventSource.CONNECTING) {
          reconnectAttempts.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          // Stop trying after max attempts or if connection is closed
          disconnect();
        }
      };
    } catch (err) {
      // Silently handle connection failures
      setIsConnecting(false);
      disconnect();
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

  // Auto-connect when playerWallet changes, but only if feature is enabled
  useEffect(() => {
    // Only attempt connection if real-time updates are enabled
    if (!ENV_CONFIG.FEATURES.REALTIME_UPDATES) {
      disconnect();
      return;
    }

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
