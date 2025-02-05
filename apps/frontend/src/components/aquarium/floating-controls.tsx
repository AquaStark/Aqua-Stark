import React from "react";

export default function FloatingControls() {
  return (
    <div className="absolute bottom-4 right-4 flex space-x-2 sm:space-x-4 md:bottom-8 md:right-8">
      <button className="p-2 bg-yellow-500 text-white rounded sm:text-lg md:text-xl">📖 Log</button>
      <button className="p-2 bg-green-500 text-white rounded sm:text-lg md:text-xl">✏ Edit</button>
      <button className="p-2 bg-red-500 text-white rounded sm:text-lg md:text-xl">🏆 Achievements</button>
    </div>
  );
}
