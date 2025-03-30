import { Card } from "../ui/card";
import { specialTraits } from "@/data/genetic-combination-data";

const Traits = () => {
  return (
    
      <Card>
        <div className="flex items-center mb-4">
          <div className="w-6 h-6 flex items-center justify-center text-blue-300 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
          </div>
          <h3 className="text-md font-medium">Special Traits</h3>
        </div>
        <p className="text-sm text-blue-200 mb-4">
          Special traits have a low chance of being passed down. When both
          parents have special traits, there's a higher chance of inheritance.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {specialTraits.map((trait) => (
            <div
              key={trait.name}
              className="bg-blue-800/30 p-2 rounded flex justify-center items-center"
            >
              <span className="text-sm font-medium text-blue-100">
                {trait.name}
              </span>
            </div>
          ))}
        </div>
      </Card>

  );
};

export default Traits;
