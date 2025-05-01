"use client"

import { useState } from "react"
import { LaboratoryTabs } from "@/components/laboratory/laboratory-tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Beaker, Search } from "lucide-react"
import { BubblesBackground } from "@/components/bubble-background"
import { fishCollection } from "@/data/fish-data"
import "@/styles/laboratory.css"
import { Footer } from "@/components/layout/footer"
import { PageHeader } from "@/components/layout/page-header"
import { useBubbles } from "@/hooks/use-bubbles"

export default function LaboratoryPage() {
  const [activeTab, setActiveTab] = useState("breeding")
  const [searchQuery, setSearchQuery] = useState("")
  const bubbles = useBubbles()

  const filteredFish = searchQuery
    ? fishCollection.filter(
        (fish) =>
          fish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fish.rarity.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : fishCollection

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900 animated-background flex flex-col">
      <BubblesBackground bubbles={bubbles} />

      <PageHeader
        title="Breeding Laboratory"
        backTo="/game"
        backText="Back to Game"
        rightContent={
          <div className="flex items-center gap-2">
            <div className="relative w-64 hidden md:block">
              <Input
                type="text"
                placeholder="Search fish..."
                className="pl-10 bg-blue-800 border-blue-700 text-white placeholder:text-blue-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
              <Beaker className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Lab Status</span>
            </Button>
          </div>
        }
      />

      <main className="relative z-20 flex flex-col items-center px-4 py-8 mx-auto max-w-7xl flex-grow w-full">
        <div className="w-full max-w-4xl mx-auto lg:max-w-7xl">
          <LaboratoryTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filteredFish={filteredFish}
          />
        </div>
      </main>

      <div className="relative z-10 mt-auto">
        <Footer />
      </div>
    </div>
  )
}
