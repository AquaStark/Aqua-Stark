import { useState, useCallback } from 'react';
import {
  calculateExperienceProgress,
  handleExperienceGain,
} from '@/utils/experience';

export const useExperience = (initialLevel = 1, initialXP = 0) => {
  const [state, setState] = useState(() => ({
    level: initialLevel,
    experience: initialXP,
  }));

  const experienceToNextLevel = useCallback(
    (lvl: number) => lvl * 100, // simple linear progression, ie each level grows by 100
    []
  );

  const progress = calculateExperienceProgress(
    state.experience,
    experienceToNextLevel(state.level)
  );

  const gainXP = (amount: number) => {
    console.log('gainXP called with', amount);
    setState(prev => {
      const result = handleExperienceGain(
        prev.level,
        prev.experience,
        amount,
        experienceToNextLevel
      );
      return {
        level: result.level,
        experience: result.experience,
      };
    });
  };

  console.log('Hook state:', state.level, state.experience, progress);

  return {
    level: state.level,
    experience: state.experience,
    requiredXP: experienceToNextLevel(state.level),
    progress,
    gainXP, // function to call to add XP
  };
};
