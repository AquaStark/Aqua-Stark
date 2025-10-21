import { useState, useEffect, useCallback } from 'react';
import { useFullscreenConfig } from './use-fullscreen-config';

interface UseFullscreenReturn {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  isSupported: boolean;
  isEnabled: boolean;
}

export function useFullscreen(): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { isFullscreenEnabled, isFullscreenSupported, features } =
    useFullscreenConfig();
  const isSupported = isFullscreenSupported && features.fullscreenAPI;

  useEffect(() => {
    // Check if fullscreen API is supported (combine with backend config)
    // Note: browserSupported is used for internal logic but not exposed

    // Check initial fullscreen state
    const checkFullscreen = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    checkFullscreen();

    // Listen for fullscreen changes
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange',
    ];

    events.forEach(event => {
      document.addEventListener(event, checkFullscreen);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, checkFullscreen);
      });
    };
  }, []);

  const enterFullscreen = useCallback(async () => {
    console.log('enterFullscreen called', { isSupported, isFullscreenEnabled });
    
    if (!isSupported || !isFullscreenEnabled) {
      console.warn('Fullscreen not supported or not enabled');
      return;
    }

    try {
      const element = document.documentElement;
      console.log('Attempting to enter fullscreen on element:', element);

      if (element.requestFullscreen) {
        console.log('Using requestFullscreen');
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        console.log('Using webkitRequestFullscreen');
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        console.log('Using mozRequestFullScreen');
        await (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        console.log('Using msRequestFullscreen');
        await (element as any).msRequestFullscreen();
      } else {
        console.warn('No fullscreen method available');
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      throw error; // Re-throw to let the caller handle it
    }
  }, [isSupported, isFullscreenEnabled]);

  const exitFullscreen = useCallback(async () => {
    if (!isSupported || !isFullscreenEnabled) return;

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  }, [isSupported, isFullscreenEnabled]);

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    isSupported,
    isEnabled: isFullscreenEnabled,
  };
}
