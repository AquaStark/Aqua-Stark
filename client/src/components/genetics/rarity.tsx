import { Card } from "../ui/card"
import { rarityData } from "@/data/genetic-combination-data"
const Rarity = () => {
  return (
    <Card>
    <div className="flex items-center mb-4">
      <div className="w-6 h-6 flex items-center justify-center text-blue-300 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="text-md font-medium">Rarity Influence</h3>
    </div>
    <p className="text-sm text-blue-200 mb-4">
      Higher rarity fish have a better chance of passing down their traits. Breeding two high-rarity
      fish increases the chance of rare offspring.
    </p>
    <div className="space-y-2">
      {rarityData.map((rarity) => (
        <div key={rarity.level} className="flex items-center">
          <span className="text-xs w-16">{rarity.level}</span>
          <div className="flex-1 h-4 bg-blue-900/50 rounded-full overflow-hidden mx-2">
            <div 
              className="h-full rounded-full" 
              style={{ 
                width: `${rarity.chance}%`,
                backgroundColor: rarity.color
              }}
            ></div>
          </div>
          <span className="text-xs w-8 text-right">{rarity.chance}%</span>
        </div>
      ))}
    </div>
  </Card>
  )
}

export default Rarity
