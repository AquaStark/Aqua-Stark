"use client"
import { useNavigate, Link } from "react-router-dom"
import { useAccount } from "@starknet-react/core"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function HeroSection() {
  const { account } = useAccount()
  const navigate = useNavigate()

  const handleStartGame = () => {
    if (!account) {
      toast.error("Connect your wallet before playing.")
      return
    }

    navigate("/start")
  }

  return (
    <section className="w-full text-center px-2 sm:px-4">
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg mb-2 sm:mb-3">
        <span className="inline-block animate-float">Dive into the world of Aqua Stark!</span>
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-white/90 mb-3 sm:mb-4 max-w-2xl mx-auto drop-shadow-md leading-tight">
        Breed, feed, and collect unique fish while customizing your aquarium in this incredible aquatic adventure.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <Button
          onClick={handleStartGame}
          className="text-base sm:text-lg md:text-xl font-bold py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-12 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-xl sm:rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 sm:border-3 md:border-4 border-green-300 border-b-4 sm:border-b-6 md:border-b-8 border-r-4 sm:border-r-6 md:border-r-8"
        >
          START GAME
        </Button>
        
        <Link to="/store">
          <Button className="text-sm sm:text-base md:text-lg font-bold py-2 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-lg sm:rounded-xl shadow-xl transform hover:scale-105 transition-all duration-200 border-2 sm:border-3 border-orange-300 border-b-3 sm:border-b-4 md:border-b-6 border-r-3 sm:border-r-4 md:border-r-6 flex items-center gap-1 sm:gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            VISIT STORE
          </Button>
        </Link>
      </div>
    </section>
  )
}