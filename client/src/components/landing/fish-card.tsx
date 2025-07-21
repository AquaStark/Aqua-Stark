"use client"
import { FishTank } from "@/components/fish-tank"

export function FishCardComponent({ name, image, price }: { name: string; image: string; price: number }) {
  return (
    <div className="bg-blue-600/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-3 border-blue-400 transform hover:scale-105 transition-all duration-300 hover:shadow-3xl animate-float-delayed h-full flex flex-col">
      <div className="p-2 sm:p-3 md:p-4 text-center flex-1 flex flex-col">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3 drop-shadow-md flex-shrink-0">{name}</h3>
        <div className="relative mx-auto w-full flex-1 min-h-0 bg-gradient-to-b from-blue-400/30 to-blue-500/30 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-blue-300/50"></div>
          <FishTank>
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="object-contain transform hover:scale-110 transition-all duration-500 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32"
            />
          </FishTank>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center justify-center flex-shrink-0">
          <div className="flex items-center gap-1 bg-yellow-500/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 border border-yellow-400/30">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            <span className="text-yellow-400 text-xs sm:text-sm font-bold">{price.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}