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

  const [isLevelingUp, setIsLevelingUp] = useState(false);

  const experienceToNextLevel = useCallback(
    (lvl: number) => lvl * 100, // simple linear progression, ie each level grows by 100
    []
  );

  const progress = calculateExperienceProgress(
    state.experience,
    experienceToNextLevel(state.level)
  );

  const gainXP = (amount: number) => {
    setState(prev => {
      const result = handleExperienceGain(
        prev.level,
        prev.experience,
        amount,
        experienceToNextLevel
      );

      if (result.level > prev.level) {
        const xpCarryOver = result.experience;

        setIsLevelingUp(true);

        setTimeout(() => {
          setState(curr => ({
            level: curr.level + 1,
            experience: 0,
          }));

          setTimeout(() => {
            setState(curr => ({
              level: curr.level,
              experience: xpCarryOver,
            }));
            setIsLevelingUp(false);
          }, 300);
        }, 1200);

        return {
          level: prev.level,
          experience: experienceToNextLevel(prev.level),
        };
      }

      return {
        level: result.level,
        experience: result.experience,
      };
    });
  };

  return {
    level: state.level,
    experience: state.experience,
    requiredXP: experienceToNextLevel(state.level),
    progress,
    isLevelingUp,
    gainXP, // call this function to add XP
  };
};
