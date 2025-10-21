import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { banners } from '@/data/mock-store';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { CountdownTimer } from './countdown-timer';
import { FishTank } from '@/components/fish-tank';
// Use the actual inferred shape from mock data

export const StoreCarousel = () => {
  return (
    <div className='max-w-7xl px-2 sm:px-4 py-2 sm:py-4 mx-auto'>
      <div className='relative'>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{
            clickable: true,
            renderBullet: (_index: number, className: string) =>
              `<span class="${className} w-2 h-2 sm:w-3 sm:h-3 bg-white/80 rounded-full mx-1 transition-all z"></span>`,
          }}
          spaceBetween={10}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
        >
          {banners.map((banner: (typeof banners)[number]) => (
            <SwiperSlide key={String(banner.title)}>
              <div
                className={`relative rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white`}
                style={{ backgroundImage: `${banner.background}` }}
              >
                {/* OFFER Badge */}
                <div
                  className='absolute top-0 right-0 text-white text-md font-bold px-4 py-1 rounded-bl-xl rounded-tr-3xl'
                  style={{ backgroundColor: '#f1c841' }}
                >
                  OFFER
                </div>

                {/* Left Side: Text */}
                <div className='flex-1 ml-8 sm:ml-12 md:ml-16'>
                  <h2 className='text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 flex items-center gap-2'>
                    {banner.title}
                  </h2>
                  <p className='text-sm sm:text-base mb-3 sm:mb-6'>
                    {banner.description}
                  </p>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4'>
                    <button className='bg-white text-blue-600 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 sm:py-2 rounded-md shadow hover:bg-gray-100 transition'>
                      {banner.buttonText}
                    </button>
                    <CountdownTimer countdown={banner.countdown} />
                  </div>
                </div>

                {/* Right Side: Banner Image */}
                <div className='flex-[0.3] flex justify-center items-center w-full mt-2 sm:mt-0'>
                  {banner.bannerVideo ? (
                    <video
                      src={banner.bannerVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className='w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] object-contain'
                    />
                  ) : (
                    <FishTank shadow={false}>
                      <img
                        src={banner.bannerImage || '/placeholder.svg'}
                        alt={`${banner.title}`}
                        width={80}
                        height={80}
                        className='w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] object-contain transform hover:scale-110 transition-all duration-500'
                      />
                    </FishTank>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}

          <div className='swiper-button-prev absolute p-1 sm:p-2 top-1/2 left-4 sm:left-2 z-10 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer after:hidden'>
            <ChevronLeftIcon className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
          </div>
          <div className='swiper-button-next absolute p-1 sm:p-2 top-1/2 right-4 sm:right-2 z-10 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer after:hidden'>
            <ChevronRightIcon className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
          </div>
        </Swiper>
      </div>
    </div>
  );
};
