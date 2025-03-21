"use client"

import type React from "react"
import { useBubbles } from "@/components/landingPage/hooks/useBubbles" 
import { Navbar } from "@/components/landingPage/navbar"
import {HeroSection} from "@/components/landingPage/hero-section"
import {FeaturedFish} from "@/components/landingPage/featured-fish"
import { FishStatusTips } from "@/components/landingPage/fish-status-tips"
import { ReadyToPlay } from "@/components/landingPage/ready-to-play"
import { Footer } from "@/components/footer"
import {BubblesEffect} from "@/components/landingPage/effects/bubbles-effect"

export default function LandingPage() {
  const { bubbles, backgroundBubbles, particles } = useBubbles() // ✅ Usamos el hook


  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-700 animated-background">
    <div className="water-movement"></div>

    <BubblesEffect bubbles={bubbles} backgroundBubbles={backgroundBubbles} particles={particles} />

<Navbar />

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center">

      <HeroSection />



      <FeaturedFish />

      <FishStatusTips />

      <ReadyToPlay />
      </main>

      <Footer />
    </div>
  )
}

