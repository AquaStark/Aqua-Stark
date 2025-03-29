"use client"

import { FaArrowLeft, FaSearch } from "react-icons/fa"
import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ShoppingBag, Wallet, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FishTank } from "@/components/fish-tank"
import fish1 from "../../public/fish/fish1.png"
import fish2 from "../../public/fish/fish2.png"
import fish3 from "../../public/fish/fish3.png"

export default function BreedingLaboratory() {
    const [bubbles, setBubbles] = useState<Array<{ id: number; size: number; left: number; animationDuration: number }>>(
      [],
    )
    const [backgroundBubbles, setBackgroundBubbles] = useState<
      Array<{
        id: number
        size: number
        left: number
        duration: number
        delay: number
        drift: number
      }>
    >([])
    const [particles, setParticles] = useState<
      Array<{
        id: number
        size: number
        top: number
        left: number
        duration: number
        delay: number
        floatX: number
        floatY: number
      }>
    >([])
  
    useEffect(() => {
      const newBubbles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        size: Math.random() * 30 + 10,
        left: Math.random() * 100,
        animationDuration: Math.random() * 15 + 5,
      }))
      setBubbles(newBubbles)
  
      const newBackgroundBubbles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 60 + 40, 
        left: Math.random() * 100,
        duration: Math.random() * 25 + 15, 
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 100, 
      }))
      setBackgroundBubbles(newBackgroundBubbles)
  
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        floatX: (Math.random() - 0.5) * 200,
        floatY: (Math.random() - 0.5) * 200,
      }))
      setParticles(newParticles)
    }, [])
  
  

  return (
    <div className="relative w-full  h-full overflow-hidden bg-gradient-to-b from-blue-500 to-blue-700 animated-background text-white p-4 md:p-6">
       <div className="water-movement"></div>
      
            {backgroundBubbles.map((bubble) => (
              <div
                key={`bg-bubble-${bubble.id}`}
                className="background-bubble"
                style={
                  {
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    left: `${bubble.left}%`,
                    bottom: "-100px",
                    "--duration": `${bubble.duration}s`,
                    "--delay": `${bubble.delay}s`,
                    "--drift": `${bubble.drift}px`,
                  } as React.CSSProperties
                }
              />
            ))}
      
            {particles.map((particle) => (
              <div
                key={`particle-${particle.id}`}
                className="floating-particle"
                style={
                  {
                    width: `${particle.size}px`,
                    height: `${particle.size}px`,
                    top: `${particle.top}%`,
                    left: `${particle.left}%`,
                    "--float-duration": `${particle.duration}s`,
                    "--float-delay": `${particle.delay}s`,
                    "--float-x": `${particle.floatX}px`,
                    "--float-y": `${particle.floatY}px`,
                  } as React.CSSProperties
                }
              />
            ))}
      
            {bubbles.map((bubble) => (
              <div
                key={bubble.id}
                className="bubble"
                style={
                  {
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    left: `${bubble.left}%`,
                    "--duration": `${bubble.animationDuration}s`,
                  } as React.CSSProperties
                }
              />
            ))}

      {/* Header */}
    <div className="lg:absolute top-0 w-full left-0 ">
    <div className="flex flex-col md:text-left p-4  w-full md:flex-row items-center justify-around bg-blue-800/50  space-y-4 md:space-y-0">
        <button className="flex items-center text-white">
          <FaArrowLeft className="mr-2" /> Back to Game
        </button>
        <h1 className="text-xl font-bold text-center md:text-left">Breeding Laboratory</h1>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search fish..."
            value=""
            className="bg-blue-700 focus:outline-none text-white px-4 py-2 rounded-lg pl-10 w-full md:w-64"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-purple-400 border-b-4 border-r-4">
         
            Lab Status
          </Button>
      </div>
    </div>

      {/* Navigation */}
      <div className="lg:grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 md:mt-20 sm:mt-20 justify-between  p-6 rounded-lg w-full max-w-5xl mx-auto font-sans  flex-wrap space-x-2 md:space-x-6 mt-16 bg-blue-800/50 px-3 py-4 text-center items-center">
        <button className="text-white transform hover:scale-105 transition-all duration-200">❤️ Breeding</button>
        <button className="text-white transform hover:scale-105 transition-all duration-200">✨ Genetics</button>
        <button className="text-white transform hover:scale-105 transition-all duration-200">🔬 Discoveries</button>
        <button className="text-white transform hover:scale-105 transition-all duration-200">🧬 Genealogy</button>
      </div>

      <div className="mt-6 text-center bg-blue-800/50  md:text-left p-6 md:p-10 rounded-lg w-full max-w-5xl mx-auto font-sans">
  <h2 className="text-lg font-semibold">Fish Genealogy</h2>
  <p className="text-gray-300">Select Fish to View Lineage</p>
  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
    
    {/* Azure Drifter */}
    <div className="bg-blue-700 p-4 rounded-lg text-center w-40 md:w-48 transform hover:scale-105 transition-all duration-200  border-blue-400 border-b-2 border-r-2">
      <img
        src = {fish1} // ✅ Add correct path
        alt="Azure Drifter"
        className="w-16 cursor-pointer md:w-20 mx-auto transform hover:scale-105 transition-all duration-200"
        width={300}
      />
      {/* <Image src={} alt></Image> */}
      <p className="mt-2 font-bold">Azure Drifter</p>
      <p className="text-gray-400">Generation 2</p>
    </div>

    {/* Golden Shimmer */}
    <div className="bg-blue-700 cursor-pointer p-4 rounded-lg text-center w-40 md:w-48 transform hover:scale-105 transition-all duration-200  border-blue-400 border-b-2 border-r-2">
      <img
        src={fish2}// ✅ Ensure correct path
        alt="Golden Shimmer"
        className="w-16 md:w-20 mx-auto transform hover:scale-105 transition-all duration-200"
      />
      <p className="mt-2 font-bold">Golden Shimmer</p>
      <p className="text-gray-400">Generation 2</p>
    </div>
  
  </div>
</div>
<div className="relative mt-4 p-6 md:p-10 rounded-lg w-full max-w-5xl mx-auto font-sans w-ull overflow-hidden bg-blue-800/50 text-white ">


      {/* Family Tree Section */}
      <div className="mt-10 flex flex-col items-center">
  <h2 className="text-lg font-semibold">Family Tree: Azure Drifter</h2>

  {/* Top Level (Unknown Parents) */}
<div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-600"></div>
        <p className="text-gray-400">Unknown</p>
        <p className="text-gray-500 text-sm">Generation 0</p>
      </div>
    ))}
  </div>
</div>

  {/* Middle Level (Parents) */}
  <div className="flex flex-wrap justify-center gap-16 md:gap-16 items-center mt-8">
    <div className="flex flex-col text-center items-center bg-blue-800/50 p-4 rounded-lg w-40">
      <img src={fish1} alt="Celestial Glowfin" className="w-16 h-16 mx-auto" />
      <p className="mt-2 font-bold">Celestial Glowfin</p>
      <p className="text-yellow-400 bg-yellow-500/20 px-4 rounded-xl text-sm">Legendary</p>
      <p className="text-gray-400 text-xs">Generation 1</p>
    </div>
    <div className="flex flex-col items-center bg-blue-800 p-4 rounded-lg w-40">
      <img src={fish2} alt="Crimson Flasher" className="w-16 h-16 mx-auto" />
      <p className="mt-2 font-bold">Crimson Flasher</p>
      <p className="text-purple-400 bg-purple-500/20 px-4 rounded-xl text-sm">Epic</p>
      <p className="text-gray-400 text-xs">Generation 1</p>
    </div>
  </div>

  {/* Bottom Level (Azure Drifter) */}
  <div className="flex justify-center items-center mt-8">
    <div className="flex flex-col items-center bg-blue-800/50 p-4 rounded-lg w-40">
      <img src={fish3} alt="Azure Drifter" className="w-16 h-16 mx-auto" />
      <p className="mt-2 font-bold">Azure Drifter</p>
      <p className="text-green-400 bg-green-500/20 px-4 rounded-xl text-sm">Common</p>
      <p className="text-gray-400 text-xs">Generation 2</p>
    </div>
  </div>
</div>

    </div>

    <div className="bg-blue-800/50 text-white  mt-4 p-6 md:p-10 rounded-lg w-full max-w-5xl mx-auto font-sans">
      {/* Title */}
      <h2 className="text-xl font-bold mb-4">Inherited Traits Analysis</h2>

      {/* Trait Inheritance Section */}
     <div className="lg:grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 lg:gap-6 md:gap-6 sm:gap-6">
     <div className="bg-blue-700 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Trait Inheritance</h3>
        <div className="space-y-6">
          {[
            { trait: "Color", father: "Blue", mother: "Red", result: "Blue", colors: ["bg-blue-500", "bg-red-500", "bg-blue-500"] },
            { trait: "Pattern", father: "Spotted", mother: "Solid", result: "Gradient", colors: ["bg-blue-500", "bg-red-500", "bg-purple-500"] },
            { trait: "Fins", father: "Long", mother: "Short", result: "Medium", colors: ["bg-blue-500","bg-red-500", "bg-green-500" ] },
          ].map((item, index) => (
            <div key={index}>
              <p className="text-sm font-semibold">{item.trait}</p>
              <div className="w-full bg-gray-700 rounded-full h-4 flex overflow-hidden mt-1">
                <div className={`${item.colors[0]} h-full w-1/2`}></div>
                <div className={`${item.colors[1]} h-full w-1/2`}></div>
                <div className={`${item.colors[2]} h-full w-1/2`}></div>
              </div>
              <p className="text-xs mt-1">Father: {item.father} | Mother: {item.mother} | Result: {item.result}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
               {/* Special Traits Section */}
      <div className="bg-blue-700 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Special Traits</h3>
        <p className="text-sm text-gray-300">
          The Azure Drifter did not inherit any special traits from its parents, despite the
          father having the Bioluminescent trait and the mother having the Fast trait.
        </p>
       <div className="justify-between gap-10">
       <p className="text-xs text-gray-400 mt-2">Father’s Special: <span className="text-blue-400">Bioluminescent</span></p>
        <p className="text-xs text-gray-400">Mother’s Special: <span className="text-yellow-400">Fast</span></p>
        <p className="text-xs text-gray-400">Offspring’s Special: <span className="text-red-400">None</span></p>
       </div>
      </div>

      {/* Special Trait Inheritance Section */}
      <div className="bg-blue-700 p-6 rounded-lg mt-6">
        <h3 className="text-lg font-semibold mb-3">Special Trait Inheritance</h3>
        <p className="text-sm text-gray-300">
          Special traits have only a 20-30% chance of being passed down to offspring. Try breeding this fish with another special trait fish to increase the chances of special trait inheritance.
        </p>
      </div>

      {/* Breeding Recommendations */}
      <div className="bg-blue-700 p-6 rounded-lg mt-6">
        <h3 className="text-lg font-semibold mb-3">Breeding Recommendations</h3>
        <p className="text-sm text-gray-300 mb-3">
          Based on genetic analysis, here are some recommended breeding pairs for this fish:
        </p>
        <div className="space-y-4">
          {[
            { name:  "Royal CrownTail", desc: "Good for top pattern inheritance" },
            { name:  "Golden Shimmer", desc: "Potential for special trait activation" },
          ].map((fish, index) => (
            <div key={index} className="bg-[#0b0d3a]p-4 rounded-md flex items-center gap-4">
                           <img width={50} src={fish1} alt="" />

             <div>
             <p className="font-semibold">{fish.name}</p>
             <p className="text-xs text-gray-400">{fish.desc}</p>
             </div>
            
            </div>
          ))}
        </div>
      </div>
      </div>
     </div>

   
    </div>

    </div>

    
  );
}
