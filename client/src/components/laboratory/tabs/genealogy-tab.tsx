"use client"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { motion } from "framer-motion"
import { fishCollection } from "@/data/fish-data"

export function GenealogyTab() {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
        <h2 className="text-xl font-bold text-white">Fish Genealogy</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
          <FileText className="h-4 w-4 mr-2" />
          Export Tree
        </Button>
      </div>

      {/* Fish selection for genealogy */}
      <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 overflow-hidden mb-4">
        <div className="p-4 border-b border-blue-700/50">
          <h3 className="font-bold text-white">Select Fish to View Lineage</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {fishCollection
              .filter((fish) => fish.generation > 1)
              .map((fish) => (
                <motion.div
                  key={fish.id}
                  className="bg-blue-700/30 rounded-lg p-3 flex flex-col items-center cursor-pointer hover:bg-blue-700/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative w-12 sm:w-16 h-12 sm:h-16 mb-2">
                    <img
                      src={fish.image || "/fish/unkown-fish.png"}
                      alt={fish.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white text-sm truncate w-full">{fish.name}</div>
                    <div className="text-xs text-blue-200">Generation {fish.generation}</div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>

      {/* Genealogy tree */}
      <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 overflow-hidden mb-4">
        <div className="p-4 border-b border-blue-700/50">
          <h3 className="font-bold text-white">Family Tree: Azure Drifter</h3>
        </div>
        <div className="p-4 overflow-x-auto">
          {/* Desktop Tree (hidden on mobile) */}
          <div className="hidden md:block min-w-[800px]">
            {/* Tree structure */}
            <div className="relative">
              {/* Generation 1 - Grandparents */}
              <div className="flex justify-center mb-16">
                <div className="flex gap-32">
                  {/* Paternal grandparents */}
                  <div className="flex gap-4">
                    <div className="genealogy-node">
                      <div className="relative w-16 h-16 mb-2">
                        <img src="/fish/unkown-fish.png" alt="Unknown" className="w-full h-full object-contain opacity-50" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white/50">Unknown</div>
                        <div className="text-xs text-blue-200/50">Generation 0</div>
                      </div>
                    </div>
                    <div className="genealogy-node">
                      <div className="relative w-16 h-16 mb-2">
                        <img src="/fish/unkown-fish.png" alt="Unknown" className="w-full h-full object-contain opacity-50" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white/50">Unknown</div>
                        <div className="text-xs text-blue-200/50">Generation 0</div>
                      </div>
                    </div>
                  </div>

                  {/* Maternal grandparents */}
                  <div className="flex gap-4">
                    <div className="genealogy-node">
                      <div className="relative w-16 h-16 mb-2">
                        <img src="/fish/unkown-fish.png" alt="Unknown" className="w-full h-full object-contain opacity-50" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white/50">Unknown</div>
                        <div className="text-xs text-blue-200/50">Generation 0</div>
                      </div>
                    </div>
                    <div className="genealogy-node">
                      <div className="relative w-16 h-16 mb-2">
                        <img src="/fish/unkown-fish.png" alt="Unknown" className="w-full h-full object-contain opacity-50" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white/50">Unknown</div>
                        <div className="text-xs text-blue-200/50">Generation 0</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generation 2 - Parents */}
              <div className="flex justify-center mb-16">
                <div className="flex gap-32">
                  {/* Father */}
                  <div className="genealogy-node">
                    <div className="relative w-20 h-20 mb-2">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png"
                        alt="Celestial Glowfin"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-white">Celestial Glowfin</div>
                      <div className="text-xs text-blue-200">Generation 1</div>
                      <div className="mt-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/50 text-amber-100 inline-block">
                        Legendary
                      </div>
                    </div>
                  </div>

                  {/* Mother */}
                  <div className="genealogy-node">
                    <div className="relative w-20 h-20 mb-2">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish3-LOteAGqWGR4lDQ8VBBAlRSUByZL2KX.png"
                        alt="Crimson Flasher"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-white">Crimson Flasher</div>
                      <div className="text-xs text-blue-200">Generation 1</div>
                      <div className="mt-1 text-xs px-2 py-0.5 rounded-full bg-purple-500/50 text-purple-100 inline-block">
                        Epic
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generation 3 - Selected fish */}
              <div className="flex justify-center">
                <div className="genealogy-node">
                  <div className="relative w-24 h-24 mb-2">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png"
                      alt="Azure Drifter"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white text-lg">Azure Drifter</div>
                    <div className="text-sm text-blue-200">Generation 2</div>
                    <div className="mt-1 text-xs px-2 py-0.5 rounded-full bg-gray-500/50 text-gray-100 inline-block">
                      Common
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                {/* Lines from grandparents to parents */}
                <line x1="25%" y1="8%" x2="33.3%" y2="33%" stroke="#4B5563" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="33.3%" y1="8%" x2="33.3%" y2="33%" stroke="#4B5563" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="66.7%" y1="8%" x2="66.7%" y2="33%" stroke="#4B5563" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="75%" y1="8%" x2="66.7%" y2="33%" stroke="#4B5563" strokeWidth="2" strokeDasharray="5,5" />

                {/* Lines from parents to child */}
                <line x1="33.3%" y1="50%" x2="50%" y2="75%" stroke="#4B5563" strokeWidth="2" />
                <line x1="66.7%" y1="50%" x2="50%" y2="75%" stroke="#4B5563" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Mobile Tree (stacked vertically) */}
          <div className="md:hidden">
            {/* Generation 3 - Selected fish (child) */}
            <div className="flex justify-center mb-8">
              <div className="genealogy-node">
                <div className="relative w-20 h-20 mb-2">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png"
                    alt="Azure Drifter"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <div className="font-bold text-white text-lg">Azure Drifter</div>
                  <div className="text-sm text-blue-200">Generation 2</div>
                  <div className="mt-1 text-xs px-2 py-0.5 rounded-full bg-gray-500/50 text-gray-100 inline-block">
                    Common
                  </div>
                </div>
              </div>
            </div>

            {/* Parents section */}
            <div className="bg-blue-700/20 rounded-lg p-4 mb-6">
              <h4 className="text-white font-bold mb-3 text-center">Parents</h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Father */}
                <div className="genealogy-node">
                  <div className="relative w-16 h-16 mb-2 mx-auto">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png"
                      alt="Celestial Glowfin"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white text-sm">Celestial Glowfin</div>
                    <div className="text-xs text-blue-200">Generation 1</div>
                    <div className="mt-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/50 text-amber-100 inline-block">
                      Legendary
                    </div>
                  </div>
                </div>

                {/* Mother */}
                <div className="genealogy-node">
                  <div className="relative w-16 h-16 mb-2 mx-auto">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish3-LOteAGqWGR4lDQ8VBBAlRSUByZL2KX.png"
                      alt="Crimson Flasher"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-white text-sm">Crimson Flasher</div>
                    <div className="text-xs text-blue-200">Generation 1</div>
                    <div className="mt-1 text-xs px-2 py-0.5 rounded-full bg-purple-500/50 text-purple-100 inline-block">
                      Epic
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grandparents section */}
            <div className="bg-blue-700/20 rounded-lg p-4">
              <h4 className="text-white font-bold mb-3 text-center">Grandparents</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="text-center text-blue-300 text-xs mb-2">Paternal</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="genealogy-node">
                      <div className="relative w-12 h-12 mb-1 mx-auto">
                        <img src="/fish/unkown-fish.png" alt="Unknown" className="w-full h-full object-contain opacity-50" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white/50 text-xs">Unknown</div>
                        <div className="text-xs text-blue-200/50">Gen 0</div>
                      </div>
                    </div>
                    <div className="genealogy-node">
                      <div className="relative w-12 h-12 mb-1 mx-auto">
                        <img src="/fish/unkown-fish.png" alt="Unknown" className="w-full h-full object-contain opacity-50" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white/50 text-xs">Unknown</div>
                        <div className="text-xs text-blue-200/50">Gen 0</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-center text-blue-300 text-xs mb-2">Maternal</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="genealogy-node">
                      <div className="relative w-12 h-12 mb-1 mx-auto">
                        <img src="/fish/unkown-fish.png" alt="Unknown" className="w-full h-full object-contain opacity-50" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white/50 text-xs">Unknown</div>
                        <div className="text-xs text-blue-200/50">Gen 0</div>
                      </div>
                    </div>
                    <div className="genealogy-node">
                      <div className="relative w-12 h-12 mb-1 mx-auto">
                        <img src="/fish/unkown-fish.png" alt="Unknown" className="w-full h-full object-contain opacity-50" />
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white/50 text-xs">Unknown</div>
                        <div className="text-xs text-blue-200/50">Gen 0</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inherited traits analysis - Make more responsive */}
      <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl border border-blue-700/50 overflow-hidden">
        <div className="p-4 border-b border-blue-700/50">
          <h3 className="font-bold text-white">Inherited Traits Analysis</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-white mb-3">Trait Inheritance</h4>
              <div className="space-y-3">
                <TraitInheritanceBar
                  trait="Color"
                  value="Blue (from Father)"
                  father="Blue"
                  mother="Red"
                  result="Blue"
                  colors={["bg-blue-500", "bg-red-500", "bg-blue-500"]}
                />

                <TraitInheritanceBar
                  trait="Pattern"
                  value="Gradient (Mixed)"
                  father="Spotted"
                  mother="Solid"
                  result="Gradient"
                  colors={["bg-blue-500", "bg-red-500", "bg-purple-500"]}
                />

                <TraitInheritanceBar
                  trait="Fins"
                  value="Medium (Mixed)"
                  father="Long"
                  mother="Short"
                  result="Medium"
                  colors={["bg-blue-500", "bg-red-500", "bg-green-500"]}
                />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Special Traits</h4>
              <div className="bg-blue-700/30 rounded-lg p-4">
                <p className="text-blue-200 mb-4">
                  The Azure Drifter did not inherit any special traits from its parents, despite the father having the
                  Bioluminescent trait and the mother having the Fast trait.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-32 text-sm text-blue-300">Father's Special:</div>
                    <div className="text-white">Bioluminescent</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 text-sm text-blue-300">Mother's Special:</div>
                    <div className="text-white">Fast</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 text-sm text-blue-300">Offspring Special:</div>
                    <div className="text-white">None</div>
                  </div>
                </div>

                <div className="mt-4 bg-blue-800/50 rounded-lg p-3">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-300 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-white">Special Trait Inheritance</h5>
                      <p className="text-blue-200 text-sm">
                        Special traits have only a 20-30% chance of being passed down to offspring. Try breeding this
                        fish with another special trait fish to increase the chances of special trait inheritance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-white mt-6 mb-3">Breeding Recommendations</h4>
              <div className="bg-blue-700/30 rounded-lg p-4">
                <p className="text-blue-200 mb-4">
                  Based on the genetic analysis, here are some recommended breeding pairs for this fish:
                </p>

                <div className="space-y-3">
                  <div className="flex items-center bg-blue-800/50 rounded-lg p-2">
                    <div className="relative w-10 h-10 mr-2">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish2-D0YdqsjY0OgI0AZg98FS0Sq7zMm2Fe.png"
                        alt="Royal Crowntail"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-white text-sm">Royal Crowntail</div>
                      <div className="text-xs text-blue-300">Chance for rare pattern inheritance</div>
                    </div>
                  </div>

                  <div className="flex items-center bg-blue-800/50 rounded-lg p-2">
                    <div className="relative w-10 h-10 mr-2">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish3-LOteAGqWGR4lDQ8VBBAlRSUByZL2KX.png"
                        alt="Golden Shimmer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-white text-sm">Golden Shimmer</div>
                      <div className="text-xs text-blue-300">Potential for special trait activation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function TraitInheritanceBar({ 
  trait, 
  value, 
  father, 
  mother, 
  result, 
  colors 
}: {
  trait: string;
  value: string;
  father: string;
  mother: string;
  result: string;
  colors: string[];
}) {
  return (
    <div className="bg-blue-700/30 rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-blue-300">{trait}</div>
        <div className="text-white">{value}</div>
      </div>
      <div className="flex items-center">
        <div className={`w-1/3 h-6 ${colors[0]} rounded-l-md`}></div>
        <div className={`w-1/3 h-6 ${colors[1]}`}></div>
        <div className={`w-1/3 h-6 ${colors[2]} rounded-r-md`}></div>
      </div>
      <div className="flex justify-between text-xs text-blue-200 mt-1">
        <div>Father: {father}</div>
        <div>Mother: {mother}</div>
        <div>Result: {result}</div>
      </div>
    </div>
  )
}

function Info(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

