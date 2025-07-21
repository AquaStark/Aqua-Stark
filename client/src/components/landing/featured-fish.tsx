import {FishCardComponent} from "@/components/landing/fish-card"

export function FeaturedFish() {
    return (
   <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-center px-2 sm:px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-3 sm:mb-4 drop-shadow-lg flex-shrink-0">Featured Fish</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 flex-1 min-h-0">
            <FishCardComponent name="REDGLOW" image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish3-LOteAGqWGR4lDQ8VBBAlRSUByZL2KX.png" price={1500} />

            <FishCardComponent name="BLUESHINE" image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png" price={2000} />

            <FishCardComponent name="TROPICORAL" image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish2-D0YdqsjY0OgI0AZg98FS0Sq7zMm2Fe.png" price={2500} />
          </div>
        </div>
    )
}