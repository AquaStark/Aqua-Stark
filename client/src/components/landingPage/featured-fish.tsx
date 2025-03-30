import {FishCardComponent} from "@/components/landingPage/fish-card"
import { ShoppingBag, Wallet, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function FeaturedFish() {
    return (
   <div className="w-full max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-lg">Featured Fish</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FishCardComponent name="REDGLOW" image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish3-LOteAGqWGR4lDQ8VBBAlRSUByZL2KX.png" price={1500} />

          <FishCardComponent name="BLUESHINE" image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png" price={2000} />

          <FishCardComponent name="TROPICORAL" image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish2-D0YdqsjY0OgI0AZg98FS0Sq7zMm2Fe.png" price={2500} />
          </div>
          <div className="flex justify-center mt-8">
            <Link to="/store">
              <Button className="text-lg font-bold py-4 px-8 bg-gradient-to-b from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-orange-300 border-b-4 border-r-4">
                <ShoppingBag className="mr-2 h-5 w-5" />
                VISIT STORE
              </Button>
            </Link>
          </div>
        </div>
    )
}