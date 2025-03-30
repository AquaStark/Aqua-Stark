import { Sparkles } from "lucide-react";

interface UndiscoveredSpecies {
  id: number;
  name: string;
  rarity: string;
  hints: string;
}

interface UndiscoveredSpeciesProps {
  species: UndiscoveredSpecies[];
}

export function UndiscoveredSpecies({ species }: UndiscoveredSpeciesProps) {
  return (
    <div className="bg-blue-900/40 backdrop-blur-sm px-4 py-4 rounded mt-8">
      <h2 className="text-gray-100 text-lg">Undiscovered Species</h2>
      <div className="rounded p-4 mt-4 flex gap-6 justify-center items-center bg-blue-500/30 backdrop-blur-sm">
        {species.map((specimen) => (
          <div key={specimen.id} className="shadow-xl">
            <div>
              <div className="flex justify-center items-center text-center flex-col gap-3 mb-3">
                <div className="bg-blue-600/30 h-16 w-16 rounded-full flex justify-center items-center">
                  <Sparkles className="text-primary" />
                </div>
                <h4 className="text-gray-100">{specimen.name}</h4>
              </div>
              <div className="bg-blue-600/30 flex flex-col gap-4 p-4 rounded">
                <div className="flex items-center justify-between">
                  <h4 className="text-gray-100">??</h4>
                  <h5 className="bg-purple-900/40 w-fit px-3 py-1 text-sm rounded text-gray-200">
                    {specimen.rarity}
                  </h5>
                </div>
                <div>
                  <h3 className="text-primary">Hints: <span className="text-gray-300 text-sm">{specimen.hints}</span></h3>
                </div>
                <div className="flex justify-center items-center">
                  <button className="bg-purple-700 py-2 rounded hover:bg-purple-700/90 w-full">Research</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}