import { Card } from "../ui/card"
import { patternInheritance } from "@/data/genetic-combination-data"
const Inheritance = () => {
  return (
    <Card>
    <div className="flex items-center mb-4">
      <div className="w-6 h-6 flex items-center justify-center text-blue-300 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </div>
      <h3 className="text-md font-medium">Pattern Inheritance</h3>
    </div>
    <p className="text-sm text-blue-200 mb-4">
      Patterns can blend or be inherited whole. Solid patterns are recessive, while complex 
      patterns like spots or stripes are dominant.
    </p>
    <div className="grid grid-cols-3 gap-2">
      {patternInheritance.map((pattern) => (
        <div key={pattern.name} className="text-center">
          <div 
            className={`w-full h-6 ${
              pattern.name === 'Solid' ? 'bg-blue-400' :
              pattern.name === 'Spotted' ? 'bg-blue-400 bg-opacity-70 bg-dotted' :
              pattern.name === 'Striped' ? 'bg-blue-400 bg-striped' :
              pattern.name === 'Gradient' ? 'bg-gradient-to-r from-blue-300 to-blue-600' :
              pattern.name === 'Metallic' ? 'bg-blue-400 bg-metallic' :
              'bg-gradient-to-r from-blue-300 via-blue-500 to-blue-400 bg-marbled'
            } rounded mb-1`}
          ></div>
          <span className="text-xs">{pattern.name}</span>
        </div>
      ))}
    </div>
  </Card>
  )
}

export default Inheritance
