import { FishCardComponent } from '@/components';

export function FeaturedFish() {
  return (
    <section className='w-full px-0.5 sm:px-1 md:px-2 lg:px-4 py-0.5 sm:py-1 md:py-2 relative z-10'>
      <div className='max-w-3xl mx-auto flex flex-col items-center'>
        <h2 className='text-xs sm:text-sm md:text-lg lg:text-xl font-extrabold text-white text-center mb-0.5 sm:mb-1 md:mb-2 drop-shadow-lg'>
          Featured Fish
        </h2>

        <div className='grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 sm:gap-1 md:gap-2 w-full max-w-xl'>
          <FishCardComponent
            name='REDGLOW'
            image='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish3-LOteAGqWGR4lDQ8VBBAlRSUByZL2KX.png'
            rarity='epic'
          />

          <FishCardComponent
            name='BLUESHINE'
            image='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png'
            rarity='rare'
          />

          <FishCardComponent
            name='TROPICORAL'
            image='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish2-D0YdqsjY0OgI0AZg98FS0Sq7zMm2Fe.png'
            rarity='legendary'
          />
        </div>
      </div>
    </section>
  );
}
