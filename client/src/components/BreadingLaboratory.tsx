"use client"

import { FaArrowLeft, FaSearch } from "react-icons/fa"
import type React from "react"
import { Button } from "@/components/ui/button"
import fish1 from "../../public/fish/fish1.png"
import fish2 from "../../public/fish/fish2.png"

export default function BreadingLaboratory() {
  
  

  return (
    <div className="">
      

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


    </div>

    
  );
}
