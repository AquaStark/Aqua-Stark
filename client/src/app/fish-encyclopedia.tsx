import { Filter } from "@/components/encyclopedia/filter";
import { FishCatalog } from "@/components/encyclopedia/fish-catalog";
import { Header } from "@/components/encyclopedia/header";
import { Sort } from "@/components/encyclopedia/sort";
import { FilterOptions, Page, SortOption } from "@/components/encyclopedia/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";


type Bubble = {
    id: number
    size: number
    left: number
    duration: number
    delay: number
}

export function FishEncyclopedia() {
    const [bubbles, setBubbles] = useState<Bubble[]>([])
    const [activeCategory, setActiveCategory] = useState<Page>("Catalog")
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState<SortOption>("name-asc")
    const [filters, setFilters] = useState<FilterOptions>({
        habitat: [],
        diet: [],
        temperament: [],
        careLevel: [],
    })



    useEffect(() => {
        const createBubble = () => {
            const newBubble = {
                id: Date.now(),
                size: Math.random() * 20 + 10,
                left: Math.random() * 100,
                duration: Math.random() * 4 + 3,
                delay: Math.random() * 2,
            }
            setBubbles((prev) => [...prev, newBubble])
            setTimeout(() => {
                setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id))
            }, newBubble.duration * 1000)
        }

        const intervalId = setInterval(createBubble, 300)
        return () => clearInterval(intervalId)
    }, [])
    return (
        <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-700 animated-background">
            <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bg-hbI9X1J6jlWP2xj88XACJcaMqDLbHW.png"
                alt="Underwater Background"
                className="absolute inset-0 w-full h-full object-cover"
            />
            {bubbles.map((bubble) => (
                <div
                    key={bubble.id}
                    className="bubble"
                    style={
                        {
                            width: `${bubble.size}px`,
                            height: `${bubble.size}px`,
                            left: `${bubble.left}%`,
                            "--duration": `${bubble.duration}s`,
                            animationDelay: `${bubble.delay}s`,
                        } as React.CSSProperties
                    }
                />
            ))}
            <div className="relative z-20 ">
                <Header />
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-1 gap-2 mb-4 bg-blue-800/50 p-1 rounded-lg">
                        {["Catalog", "Habitats", "Collection"].map((category) => (
                            <Button
                                key={category}
                                variant="ghost"
                                className={cn("flex-1 w-1/3 bg-blue-800/50 text-white/70 hover:bg-blue-700/50", { "bg-blue-600 text-white": activeCategory === category })}
                                onClick={() => setActiveCategory(category as Page)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name or scientific name..."
                                className="w-full bg-blue-900/50 border border-blue-700 rounded-md py-2 pl-10 pr-4 text-white placeholder:text-blue-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Filter filters={filters} setFilters={setFilters} />
                        <Sort sort={sortBy} setSort={setSortBy} />
                    </div>

                    {activeCategory === "Catalog" ? <FishCatalog query={searchQuery} filters={filters} setFilters={setFilters} sortBy={sortBy} /> : null}
                    {activeCategory === "Habitats" ? <p>Habitats</p> : null}
                    {activeCategory === "Collection" ? <p>Collection</p> : null}
                </div>
            </div>
        </main>
    )
}