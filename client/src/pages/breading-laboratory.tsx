import { FaDna, FaFlask, FaSitemap, FaRegLightbulb } from "react-icons/fa";
import GeneticCombinationsPage from "@/components/genetics";
import { useState } from "react";
interface HandleOnClick {
  (e: string): void;
}

const BreadingLaboratory = () => {
  const [currentTab, setCurrentTab] = useState<string>("Genetics");
  const bubbles = Array.from({ length: 10 }, (_, index) => {
    const sizeClass =
      index % 3 === 0 ? "small" : index % 3 === 1 ? "medium" : "large";
    return <div key={index} className={`bubble ${sizeClass}`} />;
  });

  const handleOnClick: HandleOnClick = (e) => {
    setCurrentTab(e);
  };
  return (
    <div className="relative bg-gradient-to-b from-blue-400 to-blue-600 text-white py-5 overflow-hidden">
      {/* Bubble Animation */}
      <div className="absolute inset-0 overflow-hidden">{bubbles}</div>

      {/* Buttons */}
      <div className="py-2 px-4 sm:px-6 flex flex-col sm:flex-row justify-between sm:mx-5 bg-blue-600 font-bold rounded relative z-10">
        {/* Breeding Button */}
        <button
          onClick={() => handleOnClick("Breeding")}
          className={`flex flex-row items-center justify-center text-white/90 hover:text-white w-full sm:w-1/4 hover:bg-blue-300 py-2 sm:py-1 mx-1 my-1 sm:my-0 ${
            currentTab === "Breeding" ? "bg-blue-500" : ""
          }`}
        >
          <FaDna className="h-5 w-5 mb-1" />
          <span className="text-xs ml-2">Breeding</span>
        </button>

        {/* Genetics Button */}
        <button
          onClick={() => handleOnClick("Genetics")}
          className={`flex flex-row items-center justify-center text-white/90 hover:text-white w-full sm:w-1/4 hover:bg-blue-300 py-2 sm:py-1 mx-1 my-1 sm:my-0 ${
            currentTab === "Genetics" ? "bg-blue-500" : ""
          }`}
        >
          <FaFlask className="h-5 w-5 mb-1" />
          <span className="text-xs ml-2">Genetics</span>
        </button>

        {/* Discoveries Button */}
        <button
          onClick={() => handleOnClick("Discoveries")}
          className={`flex flex-row items-center justify-center text-white/90 hover:text-white w-full sm:w-1/4 hover:bg-blue-300 py-2 sm:py-1 mx-1 my-1 sm:my-0 ${
            currentTab === "Discoveries" ? "bg-blue-500" : ""
          }`}
        >
          <FaRegLightbulb className="h-5 w-5 mb-1" />
          <span className="text-xs ml-2">Discoveries</span>
        </button>

        {/* Genealogy Button */}
        <button
          onClick={() => handleOnClick("Genealogy")}
          className={`flex flex-row items-center justify-center text-white/90 hover:text-white w-full sm:w-1/4 hover:bg-blue-300 py-2 sm:py-1 mx-1 my-1 sm:my-0 ${
            currentTab === "Genealogy" ? "bg-blue-500" : ""
          }`}
        >
          <FaSitemap className="h-5 w-5 mb-1" />
          <span className="text-xs ml-2">Genealogy</span>
        </button>
      </div>
      {/* Main Content */}
      {currentTab == "Genetics" && <GeneticCombinationsPage />}
      {currentTab == "Breeding" && (
        <div className="h-screen flex items-center justify-center">
          <p className="text-lg font-bold text-black">
            Breeding Page Not Ready
          </p>
        </div>
      )}
      {currentTab == "Discoveries" && (
        <div className="h-screen flex items-center justify-center">
          <p className="text-lg font-bold text-black">
            Discoveries Page Not Ready
          </p>
        </div>
      )}
      {currentTab == "Genealogy" && (
        <div className="h-screen flex items-center justify-center">
          <p className="text-lg font-bold text-black">
            Genealogy Page Not Ready
          </p>
        </div>
      )}
    </div>
  );
};

export default BreadingLaboratory;
