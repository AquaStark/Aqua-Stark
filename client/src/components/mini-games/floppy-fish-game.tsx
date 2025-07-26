// Refactored: This file now delegates to modular components in ./floppy-fish/
import { FloppyFishGameCanvas } from "./floppy-fish/FloppyFishGameCanvas";

interface FloppyFishGameProps {
  selectedFish: {
    id: string;
    name: string;
    image: string;
    experienceMultiplier: number;
  };
  onGameOver?: (score: number) => void;
}

export function FloppyFishGame({ selectedFish, onGameOver }: FloppyFishGameProps) {
  return (
    <FloppyFishGameCanvas selectedFish={selectedFish} onGameOver={onGameOver} />
  );
} 