import { ArrowLeft, Coins } from "lucide-react"
import { Link } from "react-router-dom"

interface ProfileHeaderProps {
  currency: number
}

export function ProfileHeader({ currency }: ProfileHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6 animate-fadeDown" style={{ animationDelay: "0.1s" }}>
      <Link to="/" className="flex items-center text-white hover:text-blue-200 transition-colors group">
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Game</span>
      </Link>
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="flex items-center">
        <Coins className="w-5 h-5 mr-2 text-yellow-400 animate-pulse-slow" />
        <span className="font-bold">{currency.toLocaleString()}</span>
      </div>
    </header>
  )
}
