import { useState, useCallback } from 'react';
import {
  calculateExperienceProgress,
  handleExperienceGain,
} from '@/utils/experience';

/**
 * @hook useExperience
 * @description
 * Custom hook for handling experience (XP) and leveling system.
 * Includes linear progression, progress calculation, level-up detection,
 * and smooth level-up transitions with carry-over XP.
 *
 * @param {number} [initialLevel=1] - Initial level of the player or entity.
 * @param {number} [initialXP=0] - Initial experience points.
 *
 * @returns {{
 *  level: number,
 *  experience: number,
 *  requiredXP: number,
 *  progress: number,
 *  isLevelingUp: boolean,
 *  gainXP: (amount: number) => void
 * }}
 * Returns an object with XP state and utilities:
 * - `level`: Current level.
 * - `experience`: Current XP amount.
 * - `requiredXP`: XP required to reach the next level.
 * - `progress`: Percentage progress toward the next level.
 * - `isLevelingUp`: Whether the entity is in the process of leveling up.
 * - `gainXP`: Function to increase XP.
 *
 * @example
 * ```tsx
 * import { useExperience } from '@/hooks/useExperience';
 *
 * function PlayerXP() {
 *   const { level, experience, requiredXP, progress, isLevelingUp, gainXP } = useExperience(1, 50);
 *
 *   return (
 *     <div>
 *       <p>Level: {level}</p>
 *       <p>XP: {experience}/{requiredXP}</p>
 *       <p>Progress: {progress}%</p>
 *       {isLevelingUp && <p>Leveling up...</p>}
 *       <button onClick={() => gainXP(60)}>Gain XP</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useExperience = (initialLevel = 1, initialXP = 0) => {
  const [state, setState] = useState(() => ({
    level: initialLevel,
    experience: initialXP,
  }));

  const [isLevelingUp, setIsLevelingUp] = useState(false);

  /**
   * Calculates the XP required to reach the next level.
   *
   * @function experienceToNextLevel
   * @param {number} lvl - Current level.
   * @returns {number} XP required to reach the next level.
   */
  const experienceToNextLevel = useCallback(
    (lvl: number) => lvl * 100, // simple linear progression
    []
  );

  const progress = calculateExperienceProgress(
    state.experience,
    experienceToNextLevel(state.level)
  );

  /**
   * Adds experience points and handles level-up logic.
   *
   * @function gainXP
   * @param {number} amount - The amount of XP to gain.
   * @returns {void}
   */
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
    gainXP,
  };
};
