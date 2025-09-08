// Refactored: This file now delegates to modular components in ./floppy-fish/
import { FloppyFishGameCanvas } from './floppy-fish/floppy-fish-game-canvas';

interface FloppyFishGameProps {
  selectedFish: {
    id: string;
    name: string;
    image: string;
    experienceMultiplier: number;
  };
}

export function FloppyFishGame({ selectedFish }: FloppyFishGameProps) {
  return <FloppyFishGameCanvas selectedFish={selectedFish} />;
}
