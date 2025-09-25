import { FishCardComponent } from '@/components';

export function FeaturedFish() {
  return (
    <section className='w-full px-2 sm:px-4 md:px-6 lg:px-8 py-1 sm:py-2 md:py-3 lg:py-4 relative z-10'>
      <div className='max-w-6xl mx-auto flex flex-col items-center'>
        <h2 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white text-center mb-2 sm:mb-3 md:mb-4 drop-shadow-lg'>
          Featured Fish
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 w-full max-w-3xl'>
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
