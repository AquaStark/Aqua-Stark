import { useNavigate } from 'react-router-dom';

interface LoadingNavigationOptions {
  targetRoute?: string;
  delay?: number;
  showLoading?: boolean;
}

export function useLoadingNavigation() {
  const navigate = useNavigate();

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

  const startGameWithLoading = () => {
    navigateWithLoading('/game', { delay: 4000 });
  };

  const navigateToOnboardingWithLoading = () => {
    navigateWithLoading('/onboarding', { delay: 3000 });
  };

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
