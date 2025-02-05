import React from "react";
import ProgressBar from "~/components/ui/progress-bar";

export default function StatusBar() {
  return (
    <div className="w-full h-12 bg-blue-800 text-white flex items-center justify-around px-4">
      <div className="text-center">
        <p>Cleanliness</p>
        <ProgressBar percentage={80} color="bg-green-600" />
      </div>
      <div className="text-center">
        <p>Food</p>
        <ProgressBar percentage={60} color="bg-blue-600" />
      </div>
    </div>
  );
}
