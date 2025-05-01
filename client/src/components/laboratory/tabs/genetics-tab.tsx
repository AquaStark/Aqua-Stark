"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dna, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Fish, GeneticCombination } from "@/types/fish"

interface GeneticsTabProps {
  setActiveTab: (tab: string) => void
}

export function GeneticsTab({ setActiveTab }: GeneticsTabProps) {
  const [breedingPair, setBreedingPair] = useState<{
    father: Fish | null
    mother: Fish | null
  }>({
    father: null,
    mother: null,
  })

  // Sample genetic combinations
  const geneticCombinations: GeneticCombination[] = [
    {
      trait: "Color",
      fatherGene: breedingPair.father?.traits.color || "Unknown",
      motherGene: breedingPair.mother?.traits.color || "Unknown",
      possibleOutcomes: [
        { outcome: breedingPair.father?.traits.color || "Unknown", probability: 45 },
        { outcome: breedingPair.mother?.traits.color || "Unknown", probability: 45 },
        { outcome: "Mixed", probability: 10 },
      ],
    },
    {
      trait: "Pattern",
      fatherGene: breedingPair.father?.traits.pattern || "Unknown",
      motherGene: breedingPair.mother?.traits.pattern || "Unknown",
      possibleOutcomes: [
        { outcome: breedingPair.father?.traits.pattern || "Unknown", probability: 40 },
        { outcome: breedingPair.mother?.traits.pattern || "Unknown", probability: 40 },
        { outcome: "Mixed", probability: 20 },
      ],
    },
    {
      trait: "Fins",
      fatherGene: breedingPair.father?.traits.fins || "Unknown",
      motherGene: breedingPair.mother?.traits.fins || "Unknown",
      possibleOutcomes: [
        { outcome: breedingPair.father?.traits.fins || "Unknown", probability: 35 },
        { outcome: breedingPair.mother?.traits.fins || "Unknown", probability: 35 },
        { outcome: "Dominant", probability: 30 },
      ],
    },
    {
      trait: "Size",
      fatherGene: breedingPair.father?.traits.size || "Unknown",
      motherGene: breedingPair.mother?.traits.size || "Unknown",
      possibleOutcomes: [
        { outcome: breedingPair.father?.traits.size || "Unknown", probability: 30 },
        { outcome: breedingPair.mother?.traits.size || "Unknown", probability: 30 },
        { outcome: "Average", probability: 40 },
      ],
    },
    {
      trait: "Special",
      fatherGene: breedingPair.father?.traits.special || "None",
      motherGene: breedingPair.mother?.traits.special || "None",
      possibleOutcomes: [
        { outcome: breedingPair.father?.traits.special || "None", probability: 20 },
        { outcome: breedingPair.mother?.traits.special || "None", probability: 20 },
        { outcome: "New Trait", probability: 5 },
        { outcome: "None", probability: 55 },
      ],
    },
  ]

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Genetic Combinations</h2>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Dna className="h-4 w-4 mr-2" />
          Trait Calculator
        </Button>
      </div>

      {/* Genetic combination chart */}
      <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 overflow-hidden">
        <div className="p-4 border-b border-blue-700/50">
          <h3 className="font-bold text-white">Breeding Pair Genetics</h3>
        </div>

        {breedingPair.father && breedingPair.mother ? (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Father */}
              <div className="bg-blue-700/30 rounded-lg p-3 flex items-center">
                <div className="relative w-24 h-24 mb-2">
                  <img
                    src={breedingPair.father.image || "/fish/unkown-fish.png"}
                    alt={breedingPair.father.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white">{breedingPair.father.name}</h4>
                  <div className="flex items-center mt-1">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        breedingPair.father.rarity === "Common"
                          ? "bg-gray-500/50 text-gray-100"
                          : breedingPair.father.rarity === "Uncommon"
                            ? "bg-green-500/50 text-green-100"
                            : breedingPair.father.rarity === "Rare"
                              ? "bg-blue-500/50 text-blue-100"
                              : breedingPair.father.rarity === "Epic"
                                ? "bg-purple-500/50 text-purple-100"
                                : "bg-amber-500/50 text-amber-100",
                      )}
                    >
                      {breedingPair.father.rarity}
                    </span>
                    <span className="text-blue-200 text-xs ml-2">Gen {breedingPair.father.generation}</span>
                  </div>
                </div>
              </div>

              {/* Mother */}
              <div className="bg-blue-700/30 rounded-lg p-3 flex items-center">
                <div className="relative w-24 h-24 mb-2">
                  <img
                    src={breedingPair.mother.image || "/fish/unkown-fish.png"}
                    alt={breedingPair.mother.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white">{breedingPair.mother.name}</h4>
                  <div className="flex items-center mt-1">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        breedingPair.mother.rarity === "Common"
                          ? "bg-gray-500/50 text-gray-100"
                          : breedingPair.mother.rarity === "Uncommon"
                            ? "bg-green-500/50 text-green-100"
                            : breedingPair.mother.rarity === "Rare"
                              ? "bg-blue-500/50 text-blue-100"
                              : breedingPair.mother.rarity === "Epic"
                                ? "bg-purple-500/50 text-purple-100"
                                : "bg-amber-500/50 text-amber-100",
                      )}
                    >
                      {breedingPair.mother.rarity}
                    </span>
                    <span className="text-blue-200 text-xs ml-2">Gen {breedingPair.mother.generation}</span>
                  </div>
                </div>
              </div>
            </div>

            <h4 className="font-bold text-white mb-3">Genetic Inheritance Probabilities</h4>
            <div className="space-y-4">
              {geneticCombinations.map((combo, index) => (
                <div key={index} className="bg-blue-700/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-bold text-white">{combo.trait}</h5>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-blue-300">Father: </span>
                        <span className="text-white">{combo.fatherGene}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-blue-300">Mother: </span>
                        <span className="text-white">{combo.motherGene}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {combo.possibleOutcomes.map((outcome, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-24 text-sm text-blue-200">{outcome.outcome}</div>
                        <div className="flex-1 ml-2">
                          <div className="h-5 bg-blue-900/50 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                outcome.probability > 40
                                  ? "bg-green-500"
                                  : outcome.probability > 20
                                    ? "bg-blue-500"
                                    : "bg-purple-500",
                              )}
                              style={{ width: `${outcome.probability}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-12 text-right text-sm text-white">{outcome.probability}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-700/20 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-300 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-white">Rarity Chance</h5>
                  <p className="text-blue-200 text-sm">
                    When breeding a {breedingPair.father.rarity} with a {breedingPair.mother.rarity} fish, there's a
                    small chance (5-10%) to get a fish of higher rarity than both parents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-700/30 flex items-center justify-center mx-auto mb-4">
              <Dna className="h-10 w-10 text-blue-400/70" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">No Breeding Pair Selected</h4>
            <p className="text-blue-200 text-sm mb-4">
              Select a breeding pair in the Breeding tab to view genetic combinations.
            </p>
            <Button
              variant="outline"
              className="border-blue-600 bg-blue-600 hover:bg-blue-700 hover:text-white text-white"
              onClick={() => setActiveTab("breeding")}
            >
              Go to Breeding Tab
            </Button>
          </div>
        )}
      </div>

      {/* Trait inheritance guide */}
      <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 overflow-hidden">
        <div className="p-4 border-b border-blue-700/50">
          <h3 className="font-bold text-white">Trait Inheritance Guide</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TraitInheritanceCard
              title="Color Inheritance"
              icon={<Droplet className="h-5 w-5 text-blue-300 mr-2" />}
              description="Colors typically follow dominant/recessive patterns. Primary colors (red, blue, yellow) are more dominant than secondary colors."
              traits={["Red", "Blue", "Yellow", "Green", "Purple", "Orange"]}
            />

            <TraitInheritanceCard
              title="Pattern Inheritance"
              icon={<Flame className="h-5 w-5 text-orange-300 mr-2" />}
              description="Patterns can blend or be inherited whole. Solid patterns are recessive, while complex patterns like spots or stripes are dominant."
              traits={["Solid", "Spotted", "Striped", "Gradient", "Metallic", "Marbled"]}
            />

            <TraitInheritanceCard
              title="Special Traits"
              icon={<Zap className="h-5 w-5 text-yellow-300 mr-2" />}
              description="Special traits have a low chance of being passed down. When both parents have special traits, there's a higher chance of inheritance."
              traits={["Bioluminescent", "Fast", "Shimmering", "Electric"]}
              columns={2}
            />

            <RarityInfluenceCard />
          </div>
        </div>
      </div>
    </>
  )
}

// Helper components
function TraitInheritanceCard({ title, icon, description, traits, columns = 3 }) {
  return (
    <div className="bg-blue-700/30 rounded-lg p-4">
      <h4 className="font-bold text-white flex items-center mb-3">
        {icon}
        {title}
      </h4>
      <p className="text-blue-200 text-sm mb-3">{description}</p>
      <div className={`grid grid-cols-${columns} gap-2`}>
        {traits.map((trait) => (
          <div key={trait} className="bg-blue-800/50 rounded p-2 text-center">
            <div className="text-white text-sm">{trait}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RarityInfluenceCard() {
  return (
    <div className="bg-blue-700/30 rounded-lg p-4">
      <h4 className="font-bold text-white flex items-center mb-3">
        <Star className="h-5 w-5 text-amber-300 mr-2" />
        Rarity Influence
      </h4>
      <p className="text-blue-200 text-sm mb-3">
        Higher rarity fish have a better chance of passing down their traits. Breeding two high-rarity fish increases
        the chance of rare offspring.
      </p>
      <div className="space-y-2">
        {["Common", "Uncommon", "Rare", "Epic", "Legendary"].map((rarity, index) => (
          <div key={rarity} className="flex items-center">
            <div className="w-24 text-sm text-blue-200">{rarity}</div>
            <div className="flex-1 ml-2">
              <div className="h-4 bg-blue-900/50 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    index === 0
                      ? "bg-gray-500"
                      : index === 1
                        ? "bg-green-500"
                        : index === 2
                          ? "bg-blue-500"
                          : index === 3
                            ? "bg-purple-500"
                            : "bg-amber-500",
                  )}
                  style={{ width: `${20 + index * 15}%` }}
                ></div>
              </div>
            </div>
            <div className="w-12 text-right text-sm text-white">{20 + index * 15}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Droplet(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  )
}

function Flame(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}

function Zap(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function Star(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

