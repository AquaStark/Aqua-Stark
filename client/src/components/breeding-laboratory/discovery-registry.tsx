import { FishTank } from "@/components/fish-tank";

interface Discovery {
  id: number;
  date: string;
  image: string;
  name: string;
  rarity: string;
  parents: string;
  traits: string;
}

interface DiscoveryRegistryProps {
  discoveries: Discovery[];
}

export function DiscoveryRegistry({ discoveries }: DiscoveryRegistryProps) {
  return (
    <div className="bg-blue-900/40 backdrop-blur-sm px-4 py-4 rounded mt-8">
      <h2 className="text-gray-100 text-lg">Discovery Registry</h2>
      <div className="rounded p-4 mt-4 flex gap-6 justify-center items-center bg-blue-500/30 backdrop-blur-sm">
        {discoveries.map((discovery) => (
          <div key={discovery.id} className="shadow-xl hover:scale-105 transition-all duration-200 transform">
            <div>
              <div className="flex justify-end items-end text-end mr-3">
                <h3 className="text-center bg-blue-900/40 px-3 py-1 rounded text-sm">{discovery.date}</h3>
              </div>
              <div>
                <FishTank>
                  <img src={discovery.image} className="w-36" />
                </FishTank>
                <div className="bg-blue-600/30 flex flex-col gap-4 p-4 rounded">
                  <div className="flex items-center justify-between">
                    <h4 className="text-gray-100">{discovery.name}</h4>
                    <h5 className={`bg-${discovery.rarity === 'Epic' ? 'purple' : 'blue'}-900/40 w-fit px-3 py-1 text-sm rounded text-gray-200`}>
                      {discovery.rarity}
                    </h5>
                  </div>
                  <div>
                    <h3 className="text-primary">Parents: <span className="text-gray-300 text-sm">{discovery.parents}</span></h3>
                    <h3 className="text-primary">Traits: <span className="text-gray-300 text-sm">{discovery.traits}</span></h3>
                  </div>
                  <div className="flex justify-center items-center">
                    <button className="bg-primary py-2 w-full rounded hover:bg-primary/70">View Details</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}