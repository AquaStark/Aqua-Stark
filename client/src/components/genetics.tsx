import React, { useState } from 'react';
import { FaCalculator, FaDna } from 'react-icons/fa';
import { colorInheritance } from '@/data/genetic-combination-data';
import Traits from './genetics/traits';
import Inheritance from './genetics/traits';
import Rarity from './genetics/traits';

import { Button } from './ui/button';
import { Card } from './ui/card';

const GeneticCombinationsPage: React.FC = () => {
  const [selectedPair, _setSelectedPair] = useState<string | null>(null);
  


  return (
    <div className="text-white">
      <div className="container mx-auto px-6 py-6">
     
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Genetic Combinations</h1>
          <Button className='bg-purple-600'>
            <FaCalculator className="mr-2" />
            Trait Calculator
          </Button>
        </div>
     
        <Card className="mb-8">
          <h2 className="text-lg font-medium mb-4">Breeding Pair Genetics</h2>
          
         
          {!selectedPair && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-700/50 border border-blue-500/50">
                <FaDna className="w-8 h-8 text-blue-300 opacity-70" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Breeding Pair Selected</h3>
              <p className="text-sm text-blue-200 max-w-md mb-6">
                Select a breeding pair in the Breeding tab to view genetic combinations.
              </p>
              <Button variant="outline">
                Go to Breeding Tab
              </Button>
            </div>
          )}
        </Card>
        
        {/* Trait Inheritance Guide */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Trait Inheritance Guide</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Color Inheritance */}
            <Card>
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-blue-300 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1 3a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-md font-medium">Color Inheritance</h3>
              </div>
              <p className="text-sm text-blue-200 mb-4">
                Colors typically follow dominant/recessive patterns. Primary colors (red, blue, yellow) are 
                more dominant than secondary colors.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {colorInheritance.map((color) => (
                  <div key={color.name} className="text-center">
                    <div className={`w-full h-6 bg-${color.name.toLowerCase()}-500 rounded mb-1`}></div>
                    <span className="text-xs">{color.name}</span>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Pattern Inheritance */}
            <Inheritance/>
            
            {/* Special Traits */}
            <Traits/>
             
             <Rarity/>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneticCombinationsPage;