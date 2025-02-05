import React from "react";

type Aquarium = {
  id: string;
  name: string;
  locked?: boolean;
};

type Props = {
  aquariums: Aquarium[];
  setActiveAquarium: (id: string) => void;
};

export default function AquariumMenu({ aquariums, setActiveAquarium }: Props) {
  return (
    <div className="w-full h-16 bg-blue-600 flex items-center justify-center space-x-4 text-white overflow-x-auto px-4 py-2 sm:justify-start">
      {aquariums.map((aquarium) => (
        <button
          key={aquarium.id}
          className="px-4 py-2 bg-blue-800 rounded whitespace-nowrap sm:text-lg md:text-xl lg:text-2xl"
          onClick={() => setActiveAquarium(aquarium.id)}
        >
          {aquarium.name}
        </button>
      ))}
    </div>
  );
}