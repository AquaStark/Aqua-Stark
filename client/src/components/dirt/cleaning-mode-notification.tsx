import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Sparkles, X, Info } from 'lucide-react';

interface CleaningModeNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  dirtLevel: number;
  cleaningType: 'partial' | 'complete';
  className?: string;
}

export function CleaningModeNotification({
  isVisible,
  onClose,
  dirtLevel,
  cleaningType,
  className = '',
}: CleaningModeNotificationProps) {
  const getCleaningMessage = () => {
    if (cleaningType === 'complete') {
      return 'Complete cleaning in progress! Your aquarium will be spotless.';
    }
    return 'Partial cleaning in progress! Removing some dirt from your aquarium.';
  };

  const getCleaningIcon = () => {
    return cleaningType === 'complete' ? (
      <Sparkles className="w-5 h-5 text-blue-500" />
    ) : (
      <Droplets className="w-5 h-5 text-green-500" />
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
        >
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getCleaningIcon()}
                <h3 className="font-semibold text-gray-800">
                  {cleaningType === 'complete' ? 'Complete Cleaning' : 'Partial Cleaning'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message */}
            <p className="text-sm text-gray-600 mb-3">
              {getCleaningMessage()}
            </p>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              </div>
              <span className="text-xs text-gray-500">Cleaning...</span>
            </div>

            {/* Dirt Level Info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Before: {Math.round(dirtLevel)}% dirty</span>
              <span>After: {cleaningType === 'complete' ? '0%' : `${Math.round(dirtLevel * 0.75)}%`} dirty</span>
            </div>

            {/* Tips */}
            <div className="mt-3 p-2 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700">
                  {cleaningType === 'complete' ? (
                    'Complete cleaning resets the dirt timer. Your aquarium will stay clean longer!'
                  ) : (
                    'Partial cleaning is great for regular maintenance. Use complete cleaning for deep cleans.'
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
