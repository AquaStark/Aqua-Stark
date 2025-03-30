"use client"

import { useState } from "react"
import { GameHeader } from "@/components/game/game-header"
import { GameSidebarButtons } from "@/components/game/game-sidebar-buttons"
import { AquariumTabs } from "@/components/game/aquarium-tabs"
import { TipsPopup } from "@/components/game/tips-popup"
import { FishDisplay } from "@/components/game/fish-display"
import { MOCK_FISH, INITIAL_GAME_STATE } from "@/data/game-data"
import { useAquarium } from "@/hooks/use-aquarium"
import { useFishStats } from "@/hooks/use-fish-stats"
import { GameMenu } from "@/components/game/game-menu"
import { WaterEffects } from "@/components/game/water-effects"

export default function GamePage() {
  const { happiness, food, energy } = useFishStats(INITIAL_GAME_STATE)
  const { selectedAquarium, handleAquariumChange, aquariums } = useAquarium()
  const [showMenu, setShowMenu] = useState(false)
  const [showTips, setShowTips] = useState(false)

  const handleTipsToggle = () => {
    setShowTips(!showTips)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#005C99]">
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bg-hbI9X1J6jlWP2xj88XACJcaMqDLbHW.png"
        alt="Underwater Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 light-rays"></div>
      <div className="absolute inset-0 animate-water-movement"></div>

      <WaterEffects />

      <FishDisplay fish={MOCK_FISH} />

      <GameHeader
        happiness={happiness}
        food={food}
        energy={energy}
        onMenuToggle={() => setShowMenu(!showMenu)}
      />

      {showMenu && (
        <GameMenu show={showMenu} />
      )}

      <GameSidebarButtons />

      <div className="absolute bottom-0 right-4 mb-4">
        <TipsPopup 
          show={showTips} 
          onClose={() => setShowTips(false)} 
          onToggle={handleTipsToggle}
        />
      </div>

      <AquariumTabs
        aquariums={aquariums}
        selectedAquarium={selectedAquarium}
        onAquariumSelect={handleAquariumChange}
      />
    </div>
  )
}

