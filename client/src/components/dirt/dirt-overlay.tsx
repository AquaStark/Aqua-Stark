import React from "react";
import { AnimatePresence } from "framer-motion";
import DirtSpot from "./dirt-spot";
import { DirtSpot as DirtSpotType } from "./types";

interface DirtOverlayProps {
  spots: DirtSpotType[];
  onRemoveSpot: (id: string) => void;
}

const DirtOverlay: React.FC<DirtOverlayProps> = ({ spots, onRemoveSpot }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="relative w-full h-full pointer-events-auto">
        <AnimatePresence>
          {spots.map((spot) => (
            <DirtSpot key={spot.id} spot={spot} onRemove={onRemoveSpot} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DirtOverlay;
