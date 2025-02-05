import React from "react";

export default function SideMenu() {
  return (
    <div className="absolute right-4 top-20 flex flex-col space-y-2 sm:space-y-4 md:right-8 md:top-24">
      <button className="p-2 bg-gray-700 text-white rounded sm:text-lg md:text-xl">📦 Inventory</button>
      <button className="p-2 bg-gray-700 text-white rounded sm:text-lg md:text-xl">🎯 Missions</button>
      <button className="p-2 bg-gray-700 text-white rounded sm:text-lg md:text-xl">✅ Checklist</button>
    </div>
  );
}
