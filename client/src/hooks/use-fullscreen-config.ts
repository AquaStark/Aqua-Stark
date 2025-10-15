import { useState, useEffect } from 'react';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Use default config without backend dependency
    const defaultConfig: FullscreenConfig = {
      fullscreen: {
        enabled: true,
        supported: true,
        permissions: {
          fullscreen: 'granted',
        },
        features: {
          orientationLock: true,
          fullscreenAPI: true,
          mobileFullscreen: true,
        },
      },
    };

    setConfig(defaultConfig);
    setLoading(false);
  }, []);

  return {
    config,
    loading,
    isFullscreenEnabled: config?.fullscreen.enabled ?? true,
    isFullscreenSupported: config?.fullscreen.supported ?? true,
    features: config?.fullscreen.features ?? {
      orientationLock: true,
      fullscreenAPI: true,
      mobileFullscreen: true,
    },
  };
}
