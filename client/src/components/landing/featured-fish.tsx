import { FishCardComponent } from '@/components';

export function FeaturedFish() {
  return (
    <section className='w-full px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-4 md:py-6 relative z-10'>
      <div className='max-w-5xl mx-auto flex flex-col items-center'>
        <h2 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white text-center mb-3 sm:mb-4 md:mb-6 drop-shadow-lg'>
          Featured Fish
        </h2>

        <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 md:gap-8 w-full items-center justify-items-center'>
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

          <FishCardComponent
            name='GOLDENFIN'
            image='/fish/fish12.png'
            rarity='mythic'
            description='An extremely rare golden fish with shimmering scales. Brings prosperity to any aquarium.'
          />
        </div>
      </div>
    </section>
  );
}
