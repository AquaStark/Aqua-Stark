import { FishCardComponent } from '@/components';

export function FeaturedFish() {
  return (
    <section className='w-full px-1 sm:px-2 md:px-4 lg:px-6 py-1 sm:py-2 md:py-3 relative z-10'>
      <div className='max-w-4xl mx-auto flex flex-col items-center'>
        <h2 className='text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-white text-center mb-1 sm:mb-2 md:mb-3 drop-shadow-lg'>
          Featured Fish
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 md:gap-3 w-full max-w-2xl'>
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
