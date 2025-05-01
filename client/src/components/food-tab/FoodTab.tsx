import { useState } from "react";
import Navbar from "@/components/food-tab/Navbar";
import SpecialBundles from "@/components/food-tab/SpecialBundles";
import { FiSearch, FiFilter } from "react-icons/fi";
import { FaSort } from "react-icons/fa";

function FoodTab() {
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  const filters = ["ALL", "SPECIAL", "LEGENDARY", "RARE", "% ON SALE"];

  return (
    <div className="min-h-screen bg-blue-700 text-white p-6">
      <Navbar />

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 p-2 rounded-md text-white bg-blue-800 border border-gray-100"
          />
        </div>
        <button className="bg-blue-800 p-2 rounded-md flex items-center gap-2">
          {" "}
          <FiFilter size={20} /> Filters
        </button>
        <button className="bg-blue-800 p-2 rounded-md flex items-center gap-2">
          {" "}
          <FaSort size={20} /> Sort
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-3 py-1 rounded-full font-bold ${
              selectedFilter === filter
                ? "bg-orange-400 text-white"
                : "bg-blue-700 border border-gray"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <SpecialBundles />
    </div>
  );
}

export default FoodTab;
