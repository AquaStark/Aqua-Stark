import { useNavigate } from 'react-router-dom';

interface LoadingNavigationOptions {
  /** Target route to navigate to after loading */
  targetRoute?: string;
  /** Delay in milliseconds before navigating to the target route */
  delay?: number;
  /** Whether to show the loading screen before navigating */
  showLoading?: boolean;
}

/**
 * Hook to handle navigation with an optional loading screen and delay.
 * Useful for simulating loading states before navigating to a new route.
 *
 * @example
 * ```tsx
 * const {
 *   navigateWithLoading,
 *   startGameWithLoading,
 *   navigateToOnboardingWithLoading,
 *   navigateToAquariumsWithLoading,
 * } = useLoadingNavigation();
 *
 * // Navigate to game with loading
 * startGameWithLoading();
 *
 * // Navigate to onboarding with a shorter delay
 * navigateToOnboardingWithLoading();
 *
 * // Custom navigation
 * navigateWithLoading('/custom-route', { delay: 2000, showLoading: true });
 * ```
 *
 * @returns {{
 *   navigateWithLoading: (targetRoute?: string, options?: LoadingNavigationOptions) => void;
 *   startGameWithLoading: () => void;
 *   navigateToOnboardingWithLoading: () => void;
 *   navigateToAquariumsWithLoading: () => void;
 * }} Hook API for managing navigation with loading states.
 */
export function useLoadingNavigation() {
  const navigate = useNavigate();

  /**
   * Navigates to a route, optionally showing a loading screen and applying a delay.
   *
   * @param {string} [targetRoute='/game'] - Target route to navigate to.
   * @param {LoadingNavigationOptions} [options={}] - Navigation options.
   * @param {number} [options.delay=4000] - Delay in ms before navigating.
   * @param {boolean} [options.showLoading=true] - Whether to show the loading screen first.
   */
  const navigateWithLoading = (
    targetRoute: string = '/game',
    options: LoadingNavigationOptions = {}
  ) => {
    const { delay = 4000, showLoading = true } = options;

    if (showLoading) {
      // Navigate to loading page first
      navigate('/loading');

      // After loading completes, navigate to target route
      setTimeout(() => {
        navigate(targetRoute);
      }, delay);
    } else {
      // Direct navigation without loading screen
      navigate(targetRoute);
    }
  };

  /**
   * Shortcut for navigating to the game route with a 4000ms loading delay.
   */
  const startGameWithLoading = () => {
    navigateWithLoading('/game', { delay: 4000 });
  };

  /**
   * Shortcut for navigating to the onboarding route with a 3000ms loading delay.
   */
  const navigateToOnboardingWithLoading = () => {
    navigateWithLoading('/onboarding', { delay: 3000 });
  };

  /**
   * Shortcut for navigating to the aquariums route with a 2500ms loading delay.
   */
  const navigateToAquariumsWithLoading = () => {
    navigateWithLoading('/aquariums', { delay: 2500 });
  };

  return {
    navigateWithLoading,
    startGameWithLoading,
    navigateToOnboardingWithLoading,
    navigateToAquariumsWithLoading,
  };
}
