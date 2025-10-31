import { FishCardComponent } from '@/components';

export function FeaturedFishMobile() {
  return (
    <section className='w-full px-4 sm:px-6 md:px-8 lg:px-12 pt-0 pb-1 sm:py-2 md:py-3 relative z-10 -mt-8 sm:-mt-4 md:mt-0'>
      <div className='max-w-5xl mx-auto flex flex-col items-center'>
        <h2 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white text-center mb-0 sm:mb-0.5 md:mb-2 lg:mb-3 drop-shadow-lg'>
          Featured Fish
        </h2>

        <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-3 md:gap-6 lg:gap-8 w-full items-center justify-items-center'>
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
