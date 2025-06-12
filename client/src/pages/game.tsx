"use client"

import { useState, useEffect } from "react"
import { GameHeader } from "@/components/game/game-header"
import { GameSidebarButtons } from "@/components/game/game-sidebar-buttons"
import { AquariumTabs } from "@/components/game/aquarium-tabs"
import { TipsPopup } from "@/components/game/tips-popup"
import { FishDisplay } from "@/components/game/fish-display"

import { DirtOverlay } from "@/components/game/dirt-overlay"
import { DirtDebugControls } from "@/components/game/dirt-debug-controls"
import { DirtCounter } from "@/components/game/dirt-counter"
import { MOCK_FISH, INITIAL_GAME_STATE } from "@/data/game-data"

import { useAquarium } from "@/hooks/use-aquarium"
import { useFishStats } from "@/hooks/use-fish-stats"
import { useDirtSystemFixed as useDirtSystem } from "@/hooks/use-dirt-system-fixed"
import { GameMenu } from "@/components/game/game-menu"
import { useBubbles } from "@/hooks/use-bubbles"
import { BubblesBackground } from "@/components/bubble-background"
import { motion } from "framer-motion"

export default function GamePage() {
  const { happiness, food, energy } = useFishStats(INITIAL_GAME_STATE)
  const { selectedAquarium, handleAquariumChange, aquariums } = useAquarium()
  const [showMenu, setShowMenu] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [showDirtDebug, setShowDirtDebug] = useState(false) // Debug controls visibility  // Initialize dirt system
  const dirtSystem = useDirtSystem({
    spawnInterval: 5000, // 5 seconds
    maxSpots: 5,
    aquariumBounds: {
      x: 0,
      y: 0,
      width: 1000,
      height: 600,
    },
    spawnChance: 0.7, // 70% chance
  })

  // Update aquarium bounds when component mounts
  useEffect(() => {
    dirtSystem.updateAquariumBounds({
      x: 100, // Account for fish tank margins
      y: 100,
      width: 800,
      height: 400,
    })
  }, [dirtSystem])

  const bubbles = useBubbles({
    initialCount: 10,
    maxBubbles: 20,
    minSize: 6,
    maxSize: 30,
    minDuration: 10,
    maxDuration: 18,
    interval: 400,
  })

  const handleTipsToggle = () => {
    setShowTips(!showTips)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#005C99]">
      {/* Background */}
      <img
        src="/backgrounds/background2.png"
        alt="Underwater Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Bubbles */}
      <BubblesBackground
        bubbles={bubbles}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Effects */}
      <div className="absolute inset-0 light-rays z-20"></div>

      <div className="absolute inset-0 animate-water-movement z-20"></div>      {/* Fish */}
      <FishDisplay fish={MOCK_FISH} />      {/* Dirt System */}
      <DirtOverlay 
        spots={dirtSystem.spots}
        onRemoveSpot={dirtSystem.removeDirtSpot}
        className="absolute inset-0 z-50"
      />

      <div className="absolute inset-0 animate-water-movement z-20"></div>

      {/* Fish */}
      <motion.div
        key={selectedAquarium.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1 }}
        className="relative z-20 w-full h-full"
      >
        <FishDisplay fish={selectedAquarium.fishes} />
      </motion.div>


      {/* Header */}
      <GameHeader
        happiness={happiness}
        food={food}
        energy={energy}
        onMenuToggle={() => setShowMenu(!showMenu)}
      />

      {showMenu && <GameMenu show={showMenu} />}
      <GameSidebarButtons />

      {/* Dirt Counter */}
      <div className="absolute top-20 left-4 z-40">
        <DirtCounter
          spotCount={dirtSystem.spots.length}
          maxSpots={dirtSystem.config.maxSpots}
          cleanlinessScore={dirtSystem.cleanlinessScore}
        />
      </div>      {/* Debug Controls */}
      {showDirtDebug && (
        <div className="absolute top-4 right-4 z-40">
          <DirtDebugControls
            isSpawnerActive={dirtSystem.isSpawnerActive}
            spotCount={dirtSystem.spots.length}
            maxSpots={dirtSystem.config.maxSpots}
            totalCreated={dirtSystem.totalSpotsCreated}
            totalRemoved={dirtSystem.totalSpotsRemoved}
            cleanlinessScore={dirtSystem.cleanlinessScore}
            onToggleSpawner={dirtSystem.toggleSpawner}
            onForceSpawn={dirtSystem.forceSpawnSpot}
            onClearAll={dirtSystem.clearAllSpots}
          />
          <button
            onClick={() => setShowDirtDebug(false)}
            className="mt-2 w-full text-xs text-gray-400 hover:text-white transition-colors"
          >
            Hide Debug
          </button>
        </div>
      )}

      {/* Show Debug Button (when hidden) */}
      {!showDirtDebug && (
        <button
          onClick={() => setShowDirtDebug(true)}
          className="absolute top-4 right-4 z-40 bg-black/50 text-white px-3 py-1 rounded text-xs hover:bg-black/70 transition-colors"
        >
          🧹 Debug
        </button>
      )}

      {/* Tips */}
      <div className="absolute bottom-0 right-4 mb-4 z-30">
        <TipsPopup
          show={showTips}
          onClose={() => setShowTips(false)}
          onToggle={handleTipsToggle}
        />
      </div>

      {/* Tabs */}
      <AquariumTabs
        aquariums={aquariums}
        selectedAquarium={selectedAquarium}
        onAquariumSelect={handleAquariumChange}
      />
    </div>
  )
}
