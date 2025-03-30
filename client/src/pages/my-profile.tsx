"use client"

import { useState, useEffect } from "react"
import mockProfileData from "@/data/mock-my-profile"
import {
  ProfileHeader,
  ProfileCard,
  ProfileTabs,
  FishCollection,
  Achievements,
  PurchaseHistory,
  PlayerStatistics,
  BackgroundBubbles
} from "@/components/profile"

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("collection")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const { username, level, joinDate, experience, currency, stats, fishCollection, playerStats } = mockProfileData

  return (
    <div className="min-h-screen bg-blue-700 text-white relative overflow-hidden">
      {/* Background bubbles */}
      <BackgroundBubbles />

      {/* Content container with margins */}
      <div
        className={`max-w-4xl mx-auto px-4 py-6 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        {/* Header */}
        <ProfileHeader currency={currency} />

        {/* Profile Card */}
        <ProfileCard 
          username={username}
          level={level}
          joinDate={joinDate}
          experience={experience}
          stats={stats}
        />

        {/* Tabs */}
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="animate-fadeIn transition-all duration-500">
          {activeTab === "collection" && <FishCollection fishCollection={fishCollection} />}
          {activeTab === "achievements" && <Achievements stats={stats} />}
          {activeTab === "purchase" && <PurchaseHistory />}

          {/* Player Statistics - Always shown */}
          <PlayerStatistics playerStats={playerStats} />
        </div>
      </div>
    </div>
  )
}
