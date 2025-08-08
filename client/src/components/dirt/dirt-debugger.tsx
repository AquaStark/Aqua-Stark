import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Bug, Play, Pause, Trash2, Zap } from "lucide-react";
import { DirtSystemState } from "./types";

interface DirtDebuggerProps {
  dirtSystem: DirtSystemState & {
    toggleSpawner: () => void;
    forceSpawn: () => void;
    clearAll: () => void;
  };
}

const DirtDebugger: React.FC<DirtDebuggerProps> = ({ dirtSystem }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="fixed top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg border border-gray-600 overflow-hidden z-50"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-white hover:bg-white/10 transition-colors"
        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-2">
          <Bug size={18} className="text-green-400" />
          <span className="font-medium">Dirt Debugger</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-gray-600"
          >
            <div className="p-4 space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-500/20 p-2 rounded border border-blue-500/30">
                  <div className="text-blue-300 font-medium">Active Spots</div>
                  <div className="text-white text-lg font-bold">
                    {dirtSystem.spots.length}
                  </div>
                </div>
                <div className="bg-green-500/20 p-2 rounded border border-green-500/30">
                  <div className="text-green-300 font-medium">Cleanliness</div>
                  <div className="text-white text-lg font-bold">
                    {Math.round(dirtSystem.cleanliness)}%
                  </div>
                </div>
                <div className="bg-purple-500/20 p-2 rounded border border-purple-500/30">
                  <div className="text-purple-300 font-medium">Created</div>
                  <div className="text-white text-lg font-bold">
                    {dirtSystem.totalCreated}
                  </div>
                </div>
                <div className="bg-orange-500/20 p-2 rounded border border-orange-500/30">
                  <div className="text-orange-300 font-medium">Removed</div>
                  <div className="text-white text-lg font-bold">
                    {dirtSystem.totalRemoved}
                  </div>
                </div>
              </div>

              {/* Spawner Status */}
              <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded border border-gray-600">
                <span className="text-gray-300">Spawner Status:</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      dirtSystem.isSpawnerActive
                        ? "bg-green-400 animate-pulse"
                        : "bg-red-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      dirtSystem.isSpawnerActive
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {dirtSystem.isSpawnerActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-2">
                <motion.button
                  onClick={dirtSystem.toggleSpawner}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded font-medium transition-colors ${
                    dirtSystem.isSpawnerActive
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {dirtSystem.isSpawnerActive ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} />
                  )}
                  {dirtSystem.isSpawnerActive
                    ? "Stop Spawner"
                    : "Start Spawner"}
                </motion.button>

                <motion.button
                  onClick={dirtSystem.forceSpawn}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Zap size={16} />
                  Force Spawn
                </motion.button>

                <motion.button
                  onClick={dirtSystem.clearAll}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 size={16} />
                  Clear All
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DirtDebugger;
