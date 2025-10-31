import { FishCardMobileComponent } from '@/components/landing/fish-card-mobile';

export function FeaturedFishMobile() {
  return (
    <section
      className='w-full px-4 pt-0 pb-1 relative z-10'
      style={{ marginTop: '-32px' }}
    >
      <div className='max-w-5xl mx-auto flex flex-col items-center'>
        <h2
          className='text-lg font-extrabold text-white text-center drop-shadow-lg'
          style={{ marginBottom: '0px' }}
        >
          Featured Fish
        </h2>

        <div
          className='grid grid-cols-2 w-full items-center justify-items-center'
          style={{ gap: '6px' }}
        >
          <FishCardMobileComponent
            name='REDGLOW'
            image='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish3-LOteAGqWGR4lDQ8VBBAlRSUByZL2KX.png'
            rarity='epic'
          />

          <FishCardMobileComponent
            name='BLUESHINE'
            image='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish1-ioYn5CvkJkCHPwgx1jBGoqibnAu5to.png'
            rarity='rare'
          />

          <FishCardMobileComponent
            name='TROPICORAL'
            image='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fish2-D0YdqsjY0OgI0AZg98FS0Sq7zMm2Fe.png'
            rarity='legendary'
          />

          <FishCardMobileComponent
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
