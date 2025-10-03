import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBubbles } from '@/hooks';
import { BubblesBackground } from '@/components/bubble-background';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
  showTips?: boolean;
  customText?: string;
  customSteps?: LoadingStep[];
  progress?: number;
  currentStep?: string;
  isComplete?: boolean;
}

interface LoadingStep {
  progress: number;
  text: string;
  duration: number;
}

const DEFAULT_LOADING_STEPS: LoadingStep[] = [
  { progress: 10, text: 'Connecting to StarkNet...', duration: 1200 },
  { progress: 25, text: 'Loading aquarium...', duration: 1000 },
  { progress: 40, text: 'Initializing fish...', duration: 1100 },
  { progress: 55, text: 'Configuring decorations...', duration: 1000 },
  { progress: 70, text: 'Synchronizing data...', duration: 1200 },
  { progress: 85, text: 'Finalizing setup...', duration: 1000 },
  { progress: 100, text: 'Ready to play!', duration: 1500 },
];

const LOADING_TIPS = [
  '💡 Keep your aquarium clean to keep your fish happy',
  '🐠 Feed your fish regularly to keep them healthy',
  '🌊 Decorations improve your fish happiness',
  '🎣 Participate in events to get special fish',
  '🏆 Complete achievements to unlock unique rewards',
];

export function LoadingScreen({
  onComplete,
  duration = 8000,
  showTips = true,
  customText,
  customSteps,
  progress: externalProgress,
  currentStep: externalCurrentStep,
  isComplete: externalIsComplete,
}: LoadingScreenProps) {
  const [internalProgress, setInternalProgress] = useState(0);
  const [internalCurrentText, setInternalCurrentText] = useState(
    'Initializing AquaStark...'
  );
  const [currentTip, setCurrentTip] = useState(LOADING_TIPS[0]);

  // Use external values if provided, otherwise use internal state
  const progress =
    externalProgress !== undefined ? externalProgress : internalProgress;
  const currentText = externalCurrentStep || internalCurrentText;
  const isComplete =
    externalIsComplete !== undefined ? externalIsComplete : false;

  // Enhanced bubbles for loading screen
  const bubbles = useBubbles({
    initialCount: 12,
    maxBubbles: 20,
    minSize: 4,
    maxSize: 20,
    minDuration: 8,
    maxDuration: 25,
    interval: 800,
  });

  // Progress simulation (only if external progress is not provided)
  useEffect(() => {
    if (externalProgress !== undefined) {
      // External progress is being managed, don't run internal simulation
      return;
    }

    const steps =
      customSteps ||
      (customText
        ? [{ progress: 100, text: customText, duration }]
        : DEFAULT_LOADING_STEPS);
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
      const progressRatio = Math.min(elapsed / totalDuration, 1);

      // Find current step based on progress
      let accumulatedProgress = 0;
      let targetStep = steps[0];

      for (const step of steps) {
        const stepProgress = step.duration / totalDuration;
        if (progressRatio <= accumulatedProgress + stepProgress) {
          targetStep = step;
          break;
        }
        accumulatedProgress += stepProgress;
      }

      const stepProgress =
        (progressRatio - accumulatedProgress) /
        (targetStep.duration / totalDuration);
      const currentProgress =
        targetStep.progress * stepProgress +
        steps
          .slice(0, steps.indexOf(targetStep))
          .reduce((sum, step) => sum + step.progress, 0);

      setInternalProgress(Math.min(currentProgress, 100));
      setInternalCurrentText(targetStep.text);

      if (progressRatio < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          onComplete?.();
        }, 1000);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [customText, customSteps, duration, onComplete, externalProgress]);

  // Handle external completion
  useEffect(() => {
    if (isComplete && onComplete) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [isComplete, onComplete]);

  // Rotate tips
  useEffect(() => {
    if (!showTips) return;

    const tipInterval = setInterval(() => {
      setCurrentTip(prev => {
        const currentIndex = LOADING_TIPS.indexOf(prev);
        const nextIndex = (currentIndex + 1) % LOADING_TIPS.length;
        return LOADING_TIPS[nextIndex];
      });
    }, 3000);

    return () => clearInterval(tipInterval);
  }, [showTips]);

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900'>
      {/* Water movement effect */}
      <div className='water-movement'></div>

      {/* Enhanced bubble background */}
      <BubblesBackground
        bubbles={bubbles}
        className='z-10'
        animationName='loading-float-up'
      />

      {/* Loading content */}
      <main className='relative z-30 flex flex-col items-center justify-center min-h-screen px-4'>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className='text-center mb-16'
        >
          <motion.img
            src='/logo/aqua-stark.png'
            alt='AquaStark'
            className='w-96 md:w-[28rem] lg:w-[32rem] h-auto mx-auto mb-6'
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className='text-white text-lg md:text-xl font-medium'
          >
            The underwater world awaits you
          </motion.p>
        </motion.div>

        {/* Loading text */}
        <AnimatePresence mode='wait'>
          <motion.p
            key={currentText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className='text-center text-blue-200 text-lg mb-8 font-medium min-h-[2rem] flex items-center justify-center'
          >
            {currentText}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <motion.div
          className='w-full max-w-2xl mx-auto mb-8'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className='relative bg-blue-900/50 rounded-full p-2 border border-blue-400/30'>
            <motion.div
              className='h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full relative overflow-hidden'
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* Shimmer effect */}
              <motion.div
                className='absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent'
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Progress percentage */}
              <div className='absolute inset-0 flex items-center justify-center'>
                <span className='text-white font-bold text-base drop-shadow-lg'>
                  {Math.round(progress)}%
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading tips card */}
        {showTips && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className='bg-blue-800/40 backdrop-blur-md p-4 rounded-xl border border-blue-400/30 w-full max-w-md shadow-lg'
          >
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentTip}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <p className='text-blue-200 text-sm text-center'>
                  {currentTip}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <div className='bg-blue-900/60 backdrop-blur-md border-t border-blue-400/30 fixed bottom-0 left-0 w-full h-16 flex items-center justify-center'>
        <p className='text-blue-200 text-sm'>
          © 2024 AquaStark - The underwater world awaits you
        </p>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes loading-float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-150vh) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
