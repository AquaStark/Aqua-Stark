import { ShoppingBag, Calendar, Coins, Gem, Utensils, FlaskConical, RefreshCw, Egg, ChevronRight } from "lucide-react"

export function PurchaseHistory() {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2 text-blue-300" />
          Purchase History
        </h2>
      </div>

      {/* Purchase History */}
      <div className="bg-blue-800 rounded-xl overflow-hidden shadow-lg">
        {/* Transaction 1 */}
        <div
          className="p-4 flex items-center border-b border-blue-700 hover:bg-blue-700/50 transition-colors animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="w-12 h-12 rounded-lg bg-blue-700 flex items-center justify-center mr-4">
            <Gem className="w-6 h-6 text-blue-300" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">Premium Aquarium Bundle</h4>
            <div className="flex items-center text-xs text-blue-300">
              <Calendar className="w-3 h-3 mr-1" />
              Apr 2, 2025
            </div>
          </div>
          <div className="flex items-center">
            <Coins className="w-4 h-4 mr-1 text-yellow-400" />
            <span className="font-bold">-2,500</span>
          </div>
        </div>

        {/* Transaction 2 */}
        <div
          className="p-4 flex items-center border-b border-blue-700 hover:bg-blue-700/50 transition-colors animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="w-12 h-12 rounded-lg bg-blue-700 flex items-center justify-center mr-4">
            <Utensils className="w-6 h-6 text-blue-300" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">Rare Fish Food Pack</h4>
            <div className="flex items-center text-xs text-blue-300">
              <Calendar className="w-3 h-3 mr-1" />
              Mar 28, 2025
            </div>
          </div>
          <div className="flex items-center">
            <Coins className="w-4 h-4 mr-1 text-yellow-400" />
            <span className="font-bold">-750</span>
          </div>
        </div>

        {/* Transaction 3 */}
        <div
          className="p-4 flex items-center border-b border-blue-700 hover:bg-blue-700/50 transition-colors animate-fadeIn"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="w-12 h-12 rounded-lg bg-blue-700 flex items-center justify-center mr-4">
            <FlaskConical className="w-6 h-6 text-blue-300" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">Celestial Breeding Tank</h4>
            <div className="flex items-center text-xs text-blue-300">
              <Calendar className="w-3 h-3 mr-1" />
              Mar 15, 2025
            </div>
          </div>
          <div className="flex items-center">
            <Coins className="w-4 h-4 mr-1 text-yellow-400" />
            <span className="font-bold">-1,200</span>
          </div>
        </div>

        {/* Transaction 4 */}
        <div
          className="p-4 flex items-center border-b border-blue-700 hover:bg-blue-700/50 transition-colors animate-fadeIn"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="w-12 h-12 rounded-lg bg-blue-700 flex items-center justify-center mr-4">
            <RefreshCw className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">Coin Package Refund</h4>
            <div className="flex items-center text-xs text-blue-300">
              <Calendar className="w-3 h-3 mr-1" />
              Mar 10, 2025
            </div>
          </div>
          <div className="flex items-center">
            <Coins className="w-4 h-4 mr-1 text-green-400" />
            <span className="font-bold text-green-400 animate-pulse-slow">+500</span>
          </div>
        </div>

        {/* Transaction 5 */}
        <div
          className="p-4 flex items-center hover:bg-blue-700/50 transition-colors animate-fadeIn"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="w-12 h-12 rounded-lg bg-blue-700 flex items-center justify-center mr-4">
            <Egg className="w-6 h-6 text-blue-300" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">Exotic Fish Egg</h4>
            <div className="flex items-center text-xs text-blue-300">
              <Calendar className="w-3 h-3 mr-1" />
              Mar 5, 2025
            </div>
          </div>
          <div className="flex items-center">
            <Coins className="w-4 h-4 mr-1 text-yellow-400" />
            <span className="font-bold">-1,800</span>
          </div>
        </div>
      </div>

      <div
        className="mt-4 flex justify-between items-center p-4 bg-blue-800 rounded-lg shadow-lg animate-fadeIn"
        style={{ animationDelay: "0.6s" }}
      >
        <span className="text-sm">Showing recent purchases</span>
        <button className="text-sm text-blue-300 hover:text-white transition-colors flex items-center group">
          View All Transactions
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
