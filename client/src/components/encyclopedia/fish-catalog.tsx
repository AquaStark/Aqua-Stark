import { fishData, type Fish } from "@/data/mock-fish-encyclopedia";
import { Bookmark } from "lucide-react"
import { useState } from "react";
import FishModal from "./fish-modal";
type Props = {
    query: string;
}



export function FishCatalog({ query }: Props) {
    const filteredFish = fishData.filter((fish) => fish.name.toLowerCase().includes(query.toLowerCase()))
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFish.map((fish) => (
                <FishCard key={fish.id} fish={fish} />
            ))}
            {query}
        </div>
    )
}



interface FishCardProps {
    fish: Fish
}

export default function FishCard({ fish }: FishCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => {
        if (fish.unlocked) {
            setIsModalOpen(true)
        }
    }

    return (
        <>
            <div
                className={`bg-blue-900 rounded-lg overflow-hidden ${fish.unlocked ? "cursor-pointer hover:bg-blue-800 hover:scale-[1.03] transition-all" : ""}`}
                onClick={openModal}
            >
                <div className="relative">
                    <div className="aspect-video bg-blue-950 flex items-center justify-center">
                        {fish.unlocked ? (
                            <div className="relative w-32 h-32 rounded-full bg-blue-800/50 flex items-center justify-center overflow-hidden">
                                <img
                                    src={fish.image || "/placeholder.svg?height=128&width=128"}
                                    alt={fish.name}

                                    className="object-contain"
                                />
                                <div className="absolute inset-0 rounded-full border-2 border-blue-400/30"></div>
                            </div>
                        ) : (
                            <div className="w-16 h-16 flex items-center justify-center">
                                <Bookmark size={32} className="text-blue-400/50" />
                            </div>
                        )}
                    </div>
                    {fish.rarity && (
                        <div
                            className={`absolute top-2 right-2  px-2 py-1 rounded text-xs font-medium ${fish.rarity === "common"
                                ? "bg-green-500"
                                : fish.rarity === "rare"
                                    ? "bg-purple-500"
                                    : fish.rarity === "new"
                                        ? "bg-amber-500"
                                        : "bg-blue-500"
                                }`}
                        >
                            {fish.rarity.charAt(0).toUpperCase() + fish.rarity.slice(1)}
                        </div>
                    )}
                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-blue-800/50 rounded-full flex items-center justify-center">
                        <Bookmark size={16} className="text-blue-300" />
                    </button>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-bold">{fish.unlocked ? fish.name : "Unknown Species"}</h3>
                    <p className="text-sm text-blue-300">
                        {fish.unlocked ? fish.scientificName : "Discover this fish to learn more"}
                    </p>

                    {fish.unlocked && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {fish.tags.map((tag, index) => (
                                <span key={index} className="text-xs px-2 py-1 rounded bg-blue-800/50 text-blue-200">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <FishModal fish={fish} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    )
}

