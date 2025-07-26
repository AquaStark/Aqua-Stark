import { forwardRef } from "react";

interface FishProps {
  fishY: number;
  scale: number;
  started: boolean;
  gameOver: boolean;
  selectedFish: {
    id: string;
    name: string;
    image: string;
    experienceMultiplier: number;
  };
  FISH_X: number;
  FISH_SIZE: number;
}

export const Fish = forwardRef<HTMLImageElement, FishProps>(
  ({ fishY, scale, started, gameOver, selectedFish, FISH_X, FISH_SIZE }, ref) => {
    // Always use the forward-facing (right direction) version of the fish image
    let fishImage = selectedFish.image;
    if (!fishImage.endsWith("-flip.png")) {
      fishImage = fishImage.replace(".png", "-flip.png");
    }
    return (
      <img
        ref={ref}
        src={fishImage}
        alt={selectedFish.name}
        className="absolute z-10"
        style={{
          left: FISH_X * scale,
          top: fishY * scale,
          width: FISH_SIZE * scale,
          height: FISH_SIZE * scale,
          transition: started ? "none" : "top 0.3s",
          filter: gameOver ? "grayscale(1)" : "none",
          objectFit: "contain",
        }}
      />
    );
  }
); 