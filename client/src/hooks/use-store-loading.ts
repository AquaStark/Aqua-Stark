import { useState, useEffect, useCallback, useRef } from 'react';
import { useStoreItems } from './use-store-items';

/**
 * Hook for managing store loading state including data and images
 * Ensures all store data and images are loaded before completing
 * Progress bar reflects real loading progress with minimum display time
 *
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-01-XX
 */
export function useStoreLoading() {
  const {
    items,
    loading: dataLoading,
    isInitialized,
    fetchStoreItems,
  } = useStoreItems();
  const [imagesLoading, setImagesLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing store...');
  const [isComplete, setIsComplete] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Minimum loading time (2.5 seconds)
  const MIN_LOADING_TIME = 2500;
  const startTimeRef = useRef<number>(0);
  const dataReadyRef = useRef<boolean>(false);

  // Function to preload images with progress tracking
  const preloadImages = useCallback(
    async (imageUrls: string[]): Promise<void> => {
      if (imageUrls.length === 0) {
        setImagesLoading(false);
        return;
      }

      setTotalImages(imageUrls.length);
      setImagesLoaded(0);
      setCurrentStep(`Loading item images... (0/${imageUrls.length})`);

      const imagePromises = imageUrls.map(url => {
        return new Promise<void>(resolve => {
          if (!url || url === '/placeholder.svg') {
            resolve();
            return;
          }

          const img = new Image();
          img.onload = () => {
            setImagesLoaded(prev => {
              const newCount = prev + 1;
              setCurrentStep(
                `Loading item images... (${newCount}/${imageUrls.length})`
              );
              return newCount;
            });
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load image: ${url}`);
            setImagesLoaded(prev => {
              const newCount = prev + 1;
              setCurrentStep(
                `Loading item images... (${newCount}/${imageUrls.length})`
              );
              return newCount;
            });
            resolve(); // Continue even if image fails
          };
          img.src = url;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoading(false);
        setCurrentStep('Store ready!');
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesLoading(false);
      }
    },
    []
  );

  // Check if minimum time has passed and data is ready
  const checkMinimumTime = useCallback(() => {
    if (!dataReadyRef.current) return;

    const elapsedTime = Date.now() - startTimeRef.current;
    const remainingTime = MIN_LOADING_TIME - elapsedTime;

    console.log('🔍 Loading Debug:', {
      elapsedTime,
      remainingTime,
      minTime: MIN_LOADING_TIME,
      dataReady: dataReadyRef.current,
    });

    if (remainingTime > 0) {
      console.log(`⏳ Waiting ${remainingTime}ms more for minimum time`);
      // Wait for remaining time before completing
      setTimeout(() => {
        console.log('✅ Minimum time completed, setting isComplete to true');
        setIsComplete(true);
      }, remainingTime);
    } else {
      console.log('✅ Minimum time already passed, completing immediately');
      // Minimum time already passed, complete immediately
      setIsComplete(true);
    }
  }, []);

  // Update progress based on real loading state
  useEffect(() => {
    let progress = 0;
    let step = 'Initializing store...';

    console.log('🔄 Progress Update:', {
      dataLoading,
      isInitialized,
      itemsLength: items.length,
      imagesLoading,
      imagesLoaded,
      totalImages,
      hasStarted,
    });

    if (dataLoading) {
      progress = 20;
      step = 'Connecting to store API...';
    } else if (isInitialized && items.length > 0) {
      progress = 40;
      step = 'Processing item data...';

      if (imagesLoading && totalImages > 0) {
        // Calculate progress based on images loaded
        const imageProgress = (imagesLoaded / totalImages) * 40; // 40% for images
        progress = 40 + imageProgress;
      } else if (!imagesLoading) {
        progress = 100;
        step = 'Store ready!';
        console.log('📦 All data and images loaded, checking minimum time...');
        dataReadyRef.current = true;
        checkMinimumTime();
      }
    } else if (hasStarted && !dataLoading && !isInitialized) {
      // If we started but no data yet, show some progress
      progress = 10;
      step = 'Waiting for data...';
    }

    setLoadingProgress(Math.min(progress, 100));
    setCurrentStep(step);
  }, [
    dataLoading,
    isInitialized,
    items.length,
    imagesLoading,
    imagesLoaded,
    totalImages,
    checkMinimumTime,
    hasStarted,
  ]);

  // Handle data loading completion
  useEffect(() => {
    if (isInitialized && items.length > 0 && !dataLoading) {
      // Extract image URLs from items
      const imageUrls = items
        .map(item => item.image_url)
        .filter(url => url && url !== '/placeholder.svg');

      // Preload images
      preloadImages(imageUrls);
    }
  }, [isInitialized, items, dataLoading, preloadImages]);

  // Check if everything is loaded
  const isFullyLoaded =
    !dataLoading && !imagesLoading && isInitialized && isComplete;

  // Initialize store data
  const initializeStore = useCallback(async () => {
    if (hasStarted) return; // Prevent multiple initializations

    try {
      setHasStarted(true);
      // Record start time for minimum loading duration
      startTimeRef.current = Date.now();
      dataReadyRef.current = false;
      setIsComplete(false);

      console.log(
        '🚀 Starting store initialization at:',
        new Date().toISOString()
      );
      console.log('📊 Current state:', {
        dataLoading,
        isInitialized,
        itemsLength: items.length,
      });

      setCurrentStep('Connecting to store API...');
      setLoadingProgress(5); // Start with some progress

      // Always fetch to ensure we have fresh data
      await fetchStoreItems();
    } catch (error) {
      console.error('Error initializing store:', error);
    }
  }, [fetchStoreItems, dataLoading, isInitialized, items.length, hasStarted]);

  // Simulate gradual progress if stuck at 0%
  useEffect(() => {
    if (hasStarted && loadingProgress === 0) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev < 10) {
            return prev + 1;
          }
          return prev;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [hasStarted, loadingProgress]);

  return {
    loading: !isFullyLoaded,
    progress: loadingProgress,
    currentStep,
    isComplete: isFullyLoaded,
    dataLoading,
    imagesLoading,
    isInitialized,
    initializeStore,
    // Additional info for debugging
    imagesLoaded,
    totalImages,
  };
}

export default useStoreLoading;
