import { useState, useEffect } from 'react';
import { useFullscreen } from './use-fullscreen';

interface UseFullscreenPromptReturn {
  showPrompt: boolean;
  hidePrompt: () => void;
  acceptFullscreen: () => void;
  declineFullscreen: () => void;
}

const FULLSCREEN_PROMPT_KEY = 'aqua-stark-fullscreen-prompted';
const FULLSCREEN_DECLINED_KEY = 'aqua-stark-fullscreen-declined';

export function useFullscreenPrompt(): UseFullscreenPromptReturn {
  const [showPrompt, setShowPrompt] = useState(false);
  const { isSupported, isEnabled, enterFullscreen, isFullscreen } =
    useFullscreen();

  // Disabled automatic fullscreen prompt since there's a dedicated button
  // useEffect(() => {
  //   // Check if we should show the prompt
  //   const shouldShowPrompt = () => {
  //     // Don't show if fullscreen is not supported or enabled
  //     if (!isSupported || !isEnabled) return false;

  //     // Don't show if already in fullscreen
  //     if (isFullscreen) return false;

  //     // Don't show if user has already been prompted
  //     const hasBeenPrompted = localStorage.getItem(FULLSCREEN_PROMPT_KEY);
  //     if (hasBeenPrompted) return false;

  //     // Don't show if user declined recently (within 24 hours)
  //     const declinedTime = localStorage.getItem(FULLSCREEN_DECLINED_KEY);
  //     if (declinedTime) {
  //       const declinedDate = new Date(declinedTime);
  //       const now = new Date();
  //       const hoursSinceDeclined =
  //         (now.getTime() - declinedDate.getTime()) / (1000 * 60 * 60);

  //       // If declined less than 24 hours ago, don't show
  //       if (hoursSinceDeclined < 24) return false;
  //     }

  //     return true;
  //   };

  //   // Show prompt after a short delay to let the app load
  //   const timer = setTimeout(() => {
  //     if (shouldShowPrompt()) {
  //       setShowPrompt(true);
  //     }
  //   }, 2000); // 2 second delay

  //   return () => clearTimeout(timer);
  // }, [isSupported, isEnabled, isFullscreen]);

  const hidePrompt = () => {
    setShowPrompt(false);
  };

  const acceptFullscreen = async () => {
    // Mark as prompted
    localStorage.setItem(FULLSCREEN_PROMPT_KEY, 'true');

    // Try to enter fullscreen
    await enterFullscreen();

    // Hide the prompt
    setShowPrompt(false);
  };

  const declineFullscreen = () => {
    // Mark as declined with timestamp
    localStorage.setItem(FULLSCREEN_DECLINED_KEY, new Date().toISOString());

    // Hide the prompt
    setShowPrompt(false);
  };

  return {
    showPrompt,
    hidePrompt,
    acceptFullscreen,
    declineFullscreen,
  };
}
