import { Fish, Trophy, ShoppingBag } from "lucide-react"

interface ProfileTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-6 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
      <button
        className={`py-3 px-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105 ${
          activeTab === "achievements" ? "bg-blue-600 shadow-md" : "bg-blue-800 hover:bg-blue-700"
        }`}
        onClick={() => setActiveTab("achievements")}
      >
        <div className="flex items-center justify-center">
          <Trophy
            className={`w-4 h-4 mr-2 transition-transform duration-300 ${activeTab === "achievements" ? "scale-110" : ""}`}
          />
          Achievements
        </div>
      </button>
      <button
        className={`py-3 px-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105 ${
          activeTab === "collection" ? "bg-blue-600 shadow-md" : "bg-blue-800 hover:bg-blue-700"
        }`}
        onClick={() => setActiveTab("collection")}
      >
        <div className="flex items-center justify-center">
          <Fish
            className={`w-4 h-4 mr-2 transition-transform duration-300 ${activeTab === "collection" ? "scale-110" : ""}`}
          />
          Collection
        </div>
      </button>
      <button
        className={`py-3 px-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105 ${
          activeTab === "purchase" ? "bg-blue-600 shadow-md" : "bg-blue-800 hover:bg-blue-700"
        }`}
        onClick={() => setActiveTab("purchase")}
      >
        <div className="flex items-center justify-center">
          <ShoppingBag
            className={`w-4 h-4 mr-2 transition-transform duration-300 ${activeTab === "purchase" ? "scale-110" : ""}`}
          />
          Purchase History
        </div>
      </button>
    </div>
  )
}
