"use client"

import { useAccount } from "@starknet-react/core"
import { useState, useEffect } from "react"
import { CairoCustomEnum } from "starknet"
import { useAquarium } from "@/hooks/dojo/useAquarium"
import { useFish } from "@/hooks/dojo/useFish"
import { PageHeader } from "@/components/layout/page-header"
import { Footer } from "@/components/layout/footer"
import { BubblesBackground } from "@/components/bubble-background"
import { useBubbles } from "@/hooks/use-bubbles"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { ComingSoonModal } from "@/components/ui/coming-soon-modal"

const fishImages: Record<string, string> = {
  AngelFish: "/fish/fish1.png",
  GoldFish: "/fish/fish2.png",
  Betta: "/fish/fish3.png",
  NeonTetra: "/fish/fish4.png",
}

export default function CreateAquarium() {
  const { account } = useAccount()
  const { newAquarium } = useAquarium()
  const { newFish } = useFish()
  const bubbles = useBubbles()
  const navigate = useNavigate()

  const [aquariumHash, setAquariumHash] = useState<string | null>(null)
  const [species, setSpecies] = useState("AngelFish")
  const [loading, setLoading] = useState(false)
  const [addingFish, setAddingFish] = useState(false)
  const [fishHash, setFishHash] = useState<string | null>(null)
  const [fishList, setFishList] = useState<string[]>([])
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Mostrar el modal automáticamente al cargar la página
  useEffect(() => {
    setShowComingSoon(true);
  }, []);

  const handleCreateAquarium = async () => {
    if (!account) return toast.error("Please connect your wallet first")
    setLoading(true)
    try {
      const res = await newAquarium(account, account.address, 1, 5)
      setAquariumHash(res.transaction_hash)
      toast.success("Aquarium purchased successfully!")
    } catch (e) {
      toast.error("Failed to purchase aquarium")
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFish = async () => {
    if (!account || !species || fishList.length >= 3) return
    setAddingFish(true)
    try {
      const cairoEnum = new CairoCustomEnum({ [species]: {} })
      const res = await newFish(account, account.address, cairoEnum)
      setFishHash(res.transaction_hash)
      setFishList([...fishList, species])
      toast.success(`Fish ${species} added!`)
    } catch (e) {
      toast.error("Failed to add fish")
      console.error("Fish Error:", e)
    } finally {
      setAddingFish(false)
    }
  }

  const handleContinue = () => {
    navigate(`/game?fishes=${encodeURIComponent(JSON.stringify(fishList))}`)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900">
      <div className="water-movement"></div>
      <PageHeader
        title="Purchase Aquarium"
        backTo="/start"
        backText="Back"
        className="bg-blue-900/60 backdrop-blur-md border-b border-blue-400/30"
      />
      <main className="flex flex-col items-center justify-center gap-6 px-4 py-16">
        <BubblesBackground bubbles={bubbles} />
        <div className="bg-blue-800/40 backdrop-blur-md p-6 rounded-xl border border-blue-400/30 w-full max-w-md shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Buy Aquarium <span className="text-sm block font-normal text-blue-200 mt-1">Price: 0.0035 STRK</span>
          </h2>
          <Button
            onClick={handleCreateAquarium}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
            disabled={loading}
          >
            {loading ? "Purchasing..." : "Buy Aquarium"}
          </Button>
          {aquariumHash && (
            <div className="mt-6 bg-blue-900/50 text-white text-sm p-4 rounded-lg border border-blue-400/40">
              <div className="mb-2 font-semibold">Aquarium Transaction Hash:</div>
              <div className="break-all">{aquariumHash}</div>
            </div>
          )}
        </div>

        {aquariumHash && (
          <div className="bg-blue-800/40 backdrop-blur-md p-6 rounded-xl border border-blue-400/30 w-full max-w-md shadow-lg text-white">
            <h2 className="text-xl font-semibold mb-4">
              Add Your First Fish <span className="text-sm block font-normal text-blue-200 mt-1">Price per fish: 0.0061 STRK</span>
            </h2>

            <div className="relative mb-6 h-64 w-full flex items-center justify-center">
              <img
                src={fishImages[species]}
                alt={species}
                className="absolute z-0 h-40 object-contain"
                style={{ marginTop: "10px" }}
              />
              <img
                src="/fish/fish-tank.svg"
                alt="Tank"
                className="absolute z-10 h-80 object-contain"
              />
            </div>

            <select
              className="w-full p-2 rounded-md bg-blue-700 text-white font-bold mb-4"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
            >
              <option value="AngelFish">Angel Fish</option>
              <option value="GoldFish">Gold Fish</option>
              <option value="Betta">Betta</option>
              <option value="NeonTetra">Neon Tetra</option>
            </select>

            <p className="mb-2 text-sm">Fish added: {fishList.length} / 3</p>

            <Button
              onClick={handleAddFish}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
              disabled={addingFish || fishList.length >= 3}
            >
              {addingFish ? "Adding..." : "Add Fish"}
            </Button>

            {fishHash && (
              <div className="mt-4 bg-green-800 text-white text-sm p-4 rounded-lg border border-green-400/40">
                <div className="mb-2 font-semibold">Last Transaction:</div>
                <div className="break-all">{fishHash}</div>
              </div>
            )}

            {fishList.length > 0 && (
              <Button
                onClick={handleContinue}
                className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
              >
                Continue
              </Button>
            )}
          </div>
        )}

        <div className="mt-12 text-white text-sm max-w-lg text-center space-y-2 opacity-80">
          <p>🌊 Your aquarium is your new aquatic home.</p>
          <p>🐟 Add different fish species and grow your collection.</p>
          <p>🧠 Each fish is unique, so choose wisely!</p>
        </div>
      </main>

      <Footer className="bg-blue-900/60 backdrop-blur-md border-t border-blue-400/30 fixed bottom-0 left-0 w-full" />

      {/* Modal Coming Soon */}
      <ComingSoonModal
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
        title="Aquarium Creation Under Development"
        description="The aquarium creation system is being built. Soon you'll be able to purchase and customize your own aquariums with unique fish."
        closable={false}
      />
    </div>
  )
}
