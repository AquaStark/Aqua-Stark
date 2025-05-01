import { sizeCompatibility } from "@/data/encyclopedia-habitat";
import { Check, X, TriangleAlert } from "lucide-react";

export default function CompatabilityGuide() {
  return (
    <div className="rounded-lg bg-[#003f86] space-y-4">
      <div className="p-4 border-b border-blue-700">
        <h2 className="text-base font-bold">Compatability Guide</h2>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-blue-200 text-sm">
          Not all fish can live together peacefully. Use this guide to create
          harmonious communities in your aquariums.
        </p>
        <div className="p-4 bg-[#014492] rounded-md shadow-md space-y-4">
          <h2 className="text-sm font-bold">Temperament Compatibility</h2>
          <table className="w-full text-xs md:text-sm text-blue-300">
            <thead>
              <tr className="font-bold">
                <th className="text-left"></th>
                <th className="text-center">Peaceful</th>
                <th className="text-center">Semi-Aggressive</th>
                <th className="text-center">Aggressive</th>
              </tr>
            </thead>
            <tbody className="w-full">
              <tr className="py-2">
                <td className="text-left py-2">Peaceful</td>
                <td className="text-center">
                  <Check className="w-4 h-4 text-green-500 mx-auto" />
                </td>
                <td className="text-center">
                  <TriangleAlert className="w-4 h-4 text-amber-500 mx-auto" />
                </td>
                <td className="text-center">
                  <X className="w-4 h-4 text-red-500 mx-auto" />
                </td>
              </tr>
              <tr className="py-2">
                <td className="text-left py-2">Semi-Aggressive</td>
                <td className="text-center">
                  <TriangleAlert className="w-4 h-4 text-amber-500 mx-auto" />
                </td>
                <td className="text-center">
                  <Check className="w-4 h-4 text-green-500 mx-auto" />
                </td>
                <td className="text-center">
                  <TriangleAlert className="w-4 h-4 text-amber-500 mx-auto" />
                </td>
              </tr>
              <tr className="py-2">
                <td className="text-left py-2">Aggressive</td>
                <td className="text-center">
                  <X className="w-4 h-4 text-red-500 mx-auto" />
                </td>
                <td className="text-center">
                  <TriangleAlert className="w-4 h-4 text-amber-500 mx-auto" />
                </td>
                <td className="text-center">
                  <TriangleAlert className="w-4 h-4 text-amber-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="space-y-2 text-left text-sm">
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Good compatibility
            </p>
            <p className="flex items-center gap-2">
              <TriangleAlert className="w-4 h-4 text-amber-500" />
              Caution needed, may work with proper space and hiding places
            </p>
            <p className="flex items-center gap-2">
              <X className="w-4 h-4 text-red-500" />
              Not recommended, high risk of aggression
            </p>
          </div>
        </div>
        <div className="p-4 bg-[#014492] rounded-md shadow-md space-y-2">
          <h2 className="text-sm font-bold">Size Compatibility</h2>
          <p className="text-blue-200 text-sm">
            Fish of similar sizes generally coexist better. Large fish may view
            much smaller fish as prey.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {sizeCompatibility.map((size) => (
              <span
                key={size.size}
                className="flex flex-col gap-2 bg-[#003e87] rounded-md p-4 text-center"
              >
                <p className="font-bold">{size.size}</p>
                <p className="text-blue-200 text-xs">{size.recommendation}</p>
              </span>
            ))}
          </div>
        </div>
        <div className="p-4 bg-[#014492] rounded-md shadow-md space-y-2">
          <h2 className="text-sm font-bold">Habitat Requirements</h2>
          <p className="text-blue-200 text-sm">
            Fish from different habitats often have incompatible water parameter
            requirements.
          </p>
          <div className="space-y-2 text-left text-xs md:text-sm">
            <p className="flex items-center gap-2">
              <TriangleAlert className="w-4 h-4 text-amber-500" />
              Never mix freshwater and saltwater species
            </p>
            <p className="flex items-center gap-2">
              <TriangleAlert className="w-4 h-4 text-amber-500" />
              Deep sea species require specialized equipment and should not be
              mixed with tropical species
            </p>
            <p className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Fish from the same habitat type are more likely to have compatible
              water parameter needs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
