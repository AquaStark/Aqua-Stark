// returns xp progress (percentage)
export const calculateExperienceProgress = (
  currentXP: number,
  requiredXP: number
): number => {
  if (requiredXP <= 0) return 0;

  const percentage = (currentXP / requiredXP) * 100;
  return Math.min(Math.max(percentage, 0), 100);
};

// handles gain and rotation of gains/progress across levels
export const handleExperienceGain = (
  currentLevel: number,
  currentXP: number,
  gainedXP: number,
  experienceToNextLevel: (level: number) => number
) => {
  let newLevel = currentLevel;
  let newXP = currentXP + gainedXP;
  let requiredXP = experienceToNextLevel(newLevel);

  while (newXP >= requiredXP) {
    newXP -= requiredXP;
    newLevel++;
    requiredXP = experienceToNextLevel(newLevel);
  }

  return {
    level: newLevel,
    experience: newXP,
    experienceToNextLevel: requiredXP,
  };
};
