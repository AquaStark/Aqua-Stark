

interface FishProps {
  selectedFish: {
    id: string;
    name: string;
    image: string;
    experienceMultiplier: number;
  };
  fishY: number;
  scale: number;
  started: boolean;
  gameOver: boolean;
  FISH_X: number;
  FISH_SIZE: number;
}

export function Fish({ selectedFish, fishY, scale, started, gameOver, FISH_X, FISH_SIZE }: FishProps) {
  // (right direction) version of the fish image
  const fishImage = selectedFish.image.replace(".png", "-flip.png");
  
  return (
    <img
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
      }}
    />
  );
} 