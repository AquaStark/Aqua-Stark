"use client"

import { useState } from "react"
import { useAccount } from "@starknet-react/core"
import { usePlayer } from "@/hooks/dojo/usePlayer"
import { PageHeader } from "@/components/layout/page-header"
import { Footer } from "@/components/layout/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { BubblesBackground } from "@/components/bubble-background"
import { useBubbles } from "@/hooks/use-bubbles"

export default function Start() {
  const { account } = useAccount()
  const { registerPlayer } = usePlayer()
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState("")
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!account) return toast.error("Connect your wallet first")
    if (!username.trim()) return toast.error("Username is required")

    try {
      setLoading(true)
      const tx = await registerPlayer(account, username.trim())
      toast.success("Player registered successfully!")
      setTxHash(tx.transaction_hash)
    } catch {
      toast.error("Failed to register player")
    } finally {
      setLoading(false)
    }
  }

  const bubbles = useBubbles()
  const handleContinue = () => {
    navigate("/onboarding")
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900 animated-background">
      <div className="water-movement"></div>
      <PageHeader
        title="Start Your Journey"
        backTo="/"
        backText="Back Home"
        className="bg-blue-900/60 backdrop-blur-md border-b border-blue-400/30"
      />


      <main className="flex flex-col items-center justify-center gap-6 px-4 py-16">
        <BubblesBackground bubbles={bubbles} />
        <div className="bg-blue-800/40 backdrop-blur-md p-6 rounded-xl border border-blue-400/30 w-full max-w-md shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Register Player</h2>
          <Input
            placeholder="Enter your username"
            className="mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            onClick={handleRegister}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
            disabled={loading}
          >
            {loading ? "Registering..." : "Start Playing"}
          </Button>

          {txHash && (
            <div className="mt-6 bg-blue-900/50 text-white text-sm p-4 rounded-lg border border-blue-400/40">
              <div className="mb-2 font-semibold">Transaction Hash:</div>
              <div className="break-all">{txHash}</div>
              <Button
                onClick={handleContinue}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Continue
              </Button>
            </div>
          )}
        </div>

        {/* Visual tips section */}
        <div className="mt-12 text-white text-sm max-w-lg text-center space-y-2 opacity-80">
          <p>💡 Tip: Choose a unique username to start your aquatic journey.</p>
          <p>🐠 Once registered, you'll be able to build your first aquarium.</p>
          <p>🪙 You’ll receive some starter coins to pick your first fish!</p>
        </div>
      </main>

      <Footer className="bg-blue-900/60 backdrop-blur-md border-t border-blue-400/30 fixed bottom-0 left-0 w-full" />
    </div>
  )
}
