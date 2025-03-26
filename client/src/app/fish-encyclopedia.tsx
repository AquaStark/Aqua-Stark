import { Header } from "@/components/encyclopedia/header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";


type Bubble = {
    id: number
    size: number
    left: number
    duration: number
    delay: number
}
type Page = "Catalog" | "Habitats" | "Collection"
export function FishEncyclopedia() {
    const [bubbles, setBubbles] = useState<Bubble[]>([])
    const [activeCategory, setActiveCategory] = useState<Page>("Catalog")


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

                    <div className="flex flex-1 gap-2 mb-6 bg-blue-800/50 p-1 rounded-lg">
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
                </div>
            </div>
        </main>
    )
}