import { Habitat } from "@/data/encyclopedia-habitat";
import { Check } from "lucide-react";

export default function HabitatCard({ habitat }: { habitat: Habitat }) {
  return (
    <div className="bg-[#014eaa] backdrop-blur-sm rounded-lg text-white shadow-md">
      <div style={{backgroundImage: `url(${habitat.image})`}} className="bg-cover bg-center flex items-start justify-end flex-col h-56 bg-gradient-to-t from-blue-900 to-white rounded-t-lg p-4">
        <h3 className="text-base font-bold">{habitat.name}</h3>
        <p className="text-blue-100">{habitat.description}</p>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h4 className="font-bold">Characteristics</h4>
          <ul className="list-disc list-inside">
            {habitat.characteristics.map((characteristic) => (
              <p
                key={characteristic}
                className="flex items-center text-blue-100 text-sm"
              >
                <Check className="w-4 h-4 mr-2 text-green-500" />
                {characteristic}
              </p>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Common Species</h4>
          <ul className="flex items-center gap-2">
            {habitat.commonSpecies.map((fish) => (
              <span
                key={fish}
                className="text-blue-100 px-2 py-1 rounded-full bg-blue-600 text-xs"
              >
                {fish}
              </span>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
