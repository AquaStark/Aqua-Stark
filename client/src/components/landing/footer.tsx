export function Footer() {
  return (
    <footer className="flex justify-center items-center gap-4 py-2 flex-shrink-0">
      <button className="text-white/50 hover:text-white/70 text-xs transition-colors duration-200">
        Terms
      </button>
      <span className="text-white/30 text-xs">•</span>
      <button className="text-white/50 hover:text-white/70 text-xs transition-colors duration-200">
        Privacy
      </button>
    </footer>
  )
}