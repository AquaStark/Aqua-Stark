import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { banners } from "@/data/mock-store";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { CountdownTimer } from "./countdown-timer";
import { FishTank } from "../fish-tank";

export const StoreCarousel = () => {
  return (
    <div className="max-w-7xl px-4 py-8 mx-auto">
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{
            clickable: true,
            renderBullet: (index, className) =>
              `<span class="${className} w-3 h-3 bg-white/80 rounded-full mx-1 transition-all z"></span>`,
          }}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={index}>
              <div
                className={`relative rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between  text-white`}
                style={{ backgroundImage: `${banner.background}` }}
              >
                {/* OFFER Badge */}
                <div
                  className="absolute top-0 right-0 text-white text-md font-bold px-4 py-1 rounded-bl-xl rounded-tr-3xl"
                  style={{ backgroundColor: "#f1c841" }}
                >
                  OFFER
                </div>

                {/* Left Side: Text */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    {banner.title}
                  </h2>
                  <p className="mb-6">{banner.description}</p>
                  <div className="flex items-center gap-4">
                    <button className="bg-white text-blue-600 text-s font-semibold px-3 py-2 rounded-md shadow hover:bg-gray-100 transition">
                      {banner.buttonText}
                    </button>
                    <CountdownTimer countdown={banner.countdown} />
                  </div>
                </div>

                {/* Right Side: Banner Image */}
                <div className="flex-[0.3] flex justify-start items-center w-full">
                  {banner.bannerVideo ? (
                    <video
                      src={banner.bannerVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-[120px] h-[120px] object-contain"
                    />
                  ) : (
                    <FishTank shadow={false}>
                      <img
                        src={banner.bannerImage || "/placeholder.svg"}
                        alt={`${banner.title}`}
                        width={120}
                        height={120}
                        className="object-contain transform hover:scale-110 transition-all duration-500"
                      />
                    </FishTank>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}

          <div className="swiper-button-prev absolute p-2 top-1/2 left-0 z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer after:hidden">
            <ChevronLeftIcon className="w-4 h-4 text-white" />
          </div>
          <div className="swiper-button-next absolute p-2 top-1/2 right-0 z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer after:hidden">
            <ChevronRightIcon className="w-4 h-4 text-white" />
          </div>
        </Swiper>
      </div>
    </div>
  );
};
