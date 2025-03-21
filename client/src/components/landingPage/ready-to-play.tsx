import { Button } from "@/components/ui/button"
export function ReadyToPlay(){
    return (
        <div className="w-full max-w-4xl mx-auto text-center mb-12">
          <div className="bg-blue-600/70 rounded-3xl p-8 backdrop-blur-sm border-2 border-blue-400/50">
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Ready to dive in?</h2>
            <p className="text-xl text-white/90 mb-8">Play Aqua Stark now and begin your aquatic adventure</p>
            <Button className="play-button text-xl font-bold py-6 px-12 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-green-300 border-b-4 border-r-4">
              PLAY NOW
            </Button>
          </div>
        </div>
    )
}