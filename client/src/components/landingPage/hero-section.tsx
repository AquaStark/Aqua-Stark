"use client"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full max-w-4xl mx-auto text-center mb-12">
      <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-6">
        <span className="inline-block animate-float">Dive into the world of Aqua Stark!</span>
      </h1>
      <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
        Breed, feed, and collect unique fish while customizing your aquarium in this incredible aquatic adventure.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <Link to="/game">
          <Button className="play-button text-xl font-bold py-6 px-12 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-green-300 border-b-4 border-r-4">
            PLAY NOW
          </Button>
        </Link>
        <Button
          variant="outline"
          className="text-lg font-bold py-6 px-8 bg-gradient-to-b from-blue-400/80 to-blue-600/80 hover:from-blue-500/80 hover:to-blue-700/80 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-blue-300 border-b-4 border-r-4"
        >
          WATCH TUTORIAL
        </Button>
      </div>
    </section>
  )
}
