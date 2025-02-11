import React from "react";

type FishProps = {
  id: string;
  name: string;
  image: string;
  position: { x: number; y: number };
  nftMetadata: {
    rarity: string;
    generation: number;
    traits: string[];
  };
};

export default function Fish({ id, name, image, position, nftMetadata }: FishProps) {
  return (
    <div className="absolute" style={{ left: `${position.x}%`, top: `${position.y}%` }}>
      <img src={image} alt={name} className="w-40 h-40 transition-transform duration-500" />
      <div className="text-white text-xs text-center mt-1">
        <p>{name}</p>
        <p>Rarity: {nftMetadata.rarity}</p>
        <p>Gen: {nftMetadata.generation}</p>
      </div>
    </div>
  );
}
