import { ChevronLeft, Info, Settings } from "lucide-react"

export function Header() {
    return (
        <header className="bg-blue-800 py-4 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <a href="#" className="text-white/80 hover:text-white flex items-center gap-1">
                    <ChevronLeft size={18} />
                    <span>Back to Game</span>
                </a>
            </div>
            <h1 className="text-2xl font-bold text-white">Fish Encyclopedia</h1>
            <div className="flex items-center gap-4">
                <button className="text-white/80 hover:text-white">
                    <Info size={20} />
                </button>
                <button className="text-white/80 hover:text-white">
                    <Settings size={20} />
                </button>
            </div>
        </header>
    )
}

