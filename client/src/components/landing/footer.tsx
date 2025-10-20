export function Footer() {
  return (
    <footer className='fixed bottom-0 left-0 right-0 z-40 flex justify-center items-center gap-2 sm:gap-3 md:gap-4 py-2 sm:py-3 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm'>
      <button className='text-white/50 hover:text-white/70 text-xs sm:text-sm transition-colors duration-200'>
        Terms
      </button>
      <span className='text-white/30 text-xs'>•</span>
      <button className='text-white/50 hover:text-white/70 text-xs sm:text-sm transition-colors duration-200'>
        Privacy
      </button>
    </footer>
  );
}
