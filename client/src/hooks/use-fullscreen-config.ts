import { useState, useEffect } from 'react';
import { useApi } from './use-api';

interface FullscreenConfig {
  fullscreen: {
    enabled: boolean;
    supported: boolean;
    permissions: {
      fullscreen: string;
    };
    features: {
      orientationLock: boolean;
      fullscreenAPI: boolean;
      mobileFullscreen: boolean;
    };
  };
}

export function useFullscreenConfig() {
  const [config, setConfig] = useState<FullscreenConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { request } = useApi();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = await request('/api/v1/fullscreen-config', {
          method: 'GET',
        });
        
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
        } else {
          setError('Failed to fetch fullscreen configuration');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback to default config if API fails
        setConfig({
          fullscreen: {
            enabled: true,
            supported: true,
            permissions: {
              fullscreen: 'granted'
            },
            features: {
              orientationLock: true,
              fullscreenAPI: true,
              mobileFullscreen: true
            }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [request]);

  return {
    config,
    loading,
    error,
    isFullscreenEnabled: config?.fullscreen.enabled ?? true,
    isFullscreenSupported: config?.fullscreen.supported ?? true,
    features: config?.fullscreen.features ?? {
      orientationLock: true,
      fullscreenAPI: true,
      mobileFullscreen: true
    }
  };
}
