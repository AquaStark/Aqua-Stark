"use client"

import { X, ArrowLeft } from "lucide-react"

import { useEffect, useState } from "react"
import { fishData, type Fish } from "@/data/mock-fish-encyclopedia"

interface FishModalProps {
    fish: Fish
    isOpen: boolean
    onClose: () => void
}

export default function FishModal({ fish: initialFish, isOpen, onClose }: FishModalProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [currentFish, setCurrentFish] = useState<Fish>(initialFish)
    const [navigationHistory, setNavigationHistory] = useState<Fish[]>([])

    // Reset current fish when initial fish changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentFish(initialFish)
            setNavigationHistory([])
        }
    }, [initialFish, isOpen])

    useEffect(() => {
        if (isOpen && !isMounted) {
            setIsMounted(true)
            // Small delay to ensure the mounting happens before the transition
            setTimeout(() => setIsVisible(true), 10)
        } else if (!isOpen && isMounted) {
            setIsVisible(false)
            // Wait for the transition to complete before unmounting
            setTimeout(() => setIsMounted(false), 300)
        }
    }, [isOpen, isMounted])

    const handleFishClick = (fishName: string) => {
        const selectedFish = fishData.find((f) => f.name === fishName && f.unlocked)
        if (selectedFish) {
            setNavigationHistory((prev) => [...prev, currentFish])
            setCurrentFish(selectedFish)
        }
    }

    const handleBackClick = () => {
        if (navigationHistory.length > 0) {
            const previousFish = navigationHistory[navigationHistory.length - 1]
            setNavigationHistory((prev) => prev.slice(0, -1))
            setCurrentFish(previousFish)
        }
    }

    if (!isMounted) return null

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-in-out ${isVisible ? "bg-black/50 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none"
                }`}
            onClick={onClose}
        >
            <div
                className={`bg-blue-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-all duration-300 ease-in-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            {navigationHistory.length > 0 && (
                                <button
                                    onClick={handleBackClick}
                                    className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-colors"
                                >
                                    <ArrowLeft size={18} />
                                </button>
                            )}
                            <h2 className="text-xl font-bold">Fish Details</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center hover:bg-blue-600 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left column - Image and basic info */}
                        <div className="flex flex-col items-center">
                            <div className="w-48 h-48 rounded-full bg-blue-900/50 flex items-center justify-center mb-4 overflow-hidden">
                                <img
                                    src={currentFish.image || "/placeholder.svg?height=180&width=180"}
                                    alt={currentFish.name}
                                    width={180}
                                    height={180}
                                    className="object-contain"
                                />
                            </div>

                            <h3 className="text-2xl font-bold text-center">{currentFish.name}</h3>
                            <p className="text-sm text-blue-300 italic text-center mb-2">{currentFish.scientificName}</p>

                            {currentFish.rarity && (
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${currentFish.rarity === "common"
                                            ? "bg-green-500"
                                            : currentFish.rarity === "rare"
                                                ? "bg-purple-500"
                                                : currentFish.rarity === "new"
                                                    ? "bg-amber-500"
                                                    : "bg-blue-500"
                                        }`}
                                >
                                    {currentFish.rarity.charAt(0).toUpperCase() + currentFish.rarity.slice(1)}
                                </span>
                            )}
                        </div>

                        {/* Right column - Details */}
                        <div className="col-span-2">
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold mb-2">Description</h4>
                                <p className="text-blue-100">
                                    {currentFish.description ||
                                        `The ${currentFish.name} is a common but beloved species known for its calming presence and gentle swimming pattern. These fish are ideal for beginners due to their hardiness and adaptability. They feature a gradient of blue hues that seem to shimmer as they move through the water.`}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Characteristics */}
                                <div>
                                    <h4 className="text-lg font-semibold mb-3">Characteristics</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-xs">•</div>
                                            <span className="text-blue-300">Habitat:</span>
                                            <span>{currentFish.habitat || "Freshwater"}</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-xs">•</div>
                                            <span className="text-blue-300">Diet:</span>
                                            <span>{currentFish.diet || "Omnivore"}</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-xs">•</div>
                                            <span className="text-blue-300">Temperament:</span>
                                            <span>{currentFish.temperament || "Peaceful"}</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-xs">•</div>
                                            <span className="text-blue-300">Size:</span>
                                            <span>{currentFish.size || "Small"}</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-xs">•</div>
                                            <span className="text-blue-300">Lifespan:</span>
                                            <span>{currentFish.lifespan || "3-5 years"}</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-xs">•</div>
                                            <span className="text-blue-300">Care Level:</span>
                                            <span>{currentFish.careLevel || "Easy"}</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Water Parameters & Special Traits */}
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-lg font-semibold mb-3">Water Parameters</h4>
                                        <div className="space-y-2">
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-blue-300">Temperature:</span>
                                                    <span>
                                                        {currentFish.waterParameters
                                                            ? `${currentFish.waterParameters.temperature.min}°F - ${currentFish.waterParameters.temperature.max}°F`
                                                            : "72°F - 80°F"}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-blue-900 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-blue-500 to-red-500 w-3/4"></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-blue-300">pH Level:</span>
                                                    <span>
                                                        {currentFish.waterParameters
                                                            ? `${currentFish.waterParameters.pH.min} - ${currentFish.waterParameters.pH.max}`
                                                            : "6.5 - 7.5"}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-blue-900 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-yellow-500 to-green-500 w-1/2"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold mb-2">Special Traits</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {currentFish.specialTraits ? (
                                                currentFish.specialTraits.map((trait, index) => (
                                                    <span key={index} className="px-3 py-1 bg-blue-700 rounded-full text-sm">
                                                        {trait}
                                                    </span>
                                                ))
                                            ) : (
                                                <>
                                                    <span className="px-3 py-1 bg-blue-700 rounded-full text-sm">Hardy</span>
                                                    <span className="px-3 py-1 bg-blue-700 rounded-full text-sm">Beginner-Friendly</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Compatibility */}
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold mb-3">Compatibility</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h5 className="text-blue-300 mb-2">Compatible With:</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {currentFish.compatibleWith ? (
                                                currentFish.compatibleWith.map((fishName, index) => (
                                                    <button
                                                        key={index}
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded-full text-sm transition-colors"
                                                        onClick={() => handleFishClick(fishName)}
                                                    >
                                                        {fishName}
                                                    </button>
                                                ))
                                            ) : (
                                                <>
                                                    <button
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded-full text-sm transition-colors"
                                                        onClick={() => handleFishClick("Bubble Floater")}
                                                    >
                                                        Bubble Floater
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded-full text-sm transition-colors"
                                                        onClick={() => handleFishClick("Coral Nibbler")}
                                                    >
                                                        Coral Nibbler
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded-full text-sm transition-colors"
                                                        onClick={() => handleFishClick("Gentle Glider")}
                                                    >
                                                        Gentle Glider
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="text-blue-300 mb-2">Incompatible With:</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {currentFish.incompatibleWith ? (
                                                currentFish.incompatibleWith.map((fishName, index) => (
                                                    <button
                                                        key={index}
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-full text-sm transition-colors"
                                                        onClick={() => handleFishClick(fishName)}
                                                    >
                                                        {fishName}
                                                    </button>
                                                ))
                                            ) : (
                                                <>
                                                    <button
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-full text-sm transition-colors"
                                                        onClick={() => handleFishClick("Crimson Betta")}
                                                    >
                                                        Crimson Betta
                                                    </button>
                                                    <button
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-full text-sm transition-colors"
                                                        onClick={() => handleFishClick("Feisty Barracuda")}
                                                    >
                                                        Feisty Barracuda
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-md font-medium transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

