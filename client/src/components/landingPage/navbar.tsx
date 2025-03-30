"use client"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="relative z-10 flex justify-between items-center p-4">
      <div className="flex items-center">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Aqua_Stark-removebg-preview-ubKSrqYo7jzOH5qXqxEw4CyRHXIjfq.png"
          alt="Aqua Stark Logo"
          width={180}
          height={80}
          className="drop-shadow-lg"
        />
      </div>
      <div className="flex items-center">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-purple-400 border-b-4 border-r-4">
          <Wallet className="mr-2 h-6 w-6" />
          Connect Wallet
        </Button>
      </div>
    </nav>
  )
}
