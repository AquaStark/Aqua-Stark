import React from "react";
import { motion } from "framer-motion";
import { DirtSpot as DirtSpotType, DirtType, DirtShape } from "./types";

interface DirtSpotProps {
  spot: DirtSpotType;
  onRemove: (id: string) => void;
}

const DirtSpot: React.FC<DirtSpotProps> = ({ spot, onRemove }) => {
  const getDirtStyle = () => {
    const baseStyle = {
      position: "absolute" as const,
      left: `${spot.x}px`,
      top: `${spot.y}px`,
      width: `${spot.size}px`,
      height: `${spot.size}px`,
      opacity: spot.opacity,
      cursor: "pointer",
      zIndex: 10,
    };

    switch (spot.type) {
      case DirtType.ALGAE:
        return {
          ...baseStyle,
          background:
            "radial-gradient(circle, #2d5016 0%, #1a3009 70%, transparent 100%)",
          borderRadius:
            spot.shape === DirtShape.CIRCLE ? "50%" : "30% 70% 70% 30%",
        };
      case DirtType.WASTE:
        return {
          ...baseStyle,
          background:
            "radial-gradient(ellipse, #4a3728 0%, #2d1f16 60%, transparent 100%)",
          borderRadius:
            spot.shape === DirtShape.OVAL
              ? "50% 50% 50% 50% / 60% 60% 40% 40%"
              : "40%",
        };
      case DirtType.DEBRIS:
        return {
          ...baseStyle,
          background:
            "linear-gradient(45deg, #3d3d3d 0%, #1a1a1a 50%, #0d0d0d 100%)",
          borderRadius:
            spot.shape === DirtShape.IRREGULAR ? "30% 70% 20% 80%" : "20%",
        };
      default:
        return {
          ...baseStyle,
          background:
            "radial-gradient(circle, #2d2d2d 0%, #1a1a1a 70%, transparent 100%)",
          borderRadius: "50%",
        };
    }
  };

  const handleClick = () => {
    onRemove(spot.id);
  };

  return (
    <motion.div
      style={getDirtStyle()}
      onClick={handleClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: spot.opacity }}
      exit={{
        scale: 0,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(255, 255, 255, 0)",
            "0 0 0 4px rgba(255, 255, 255, 0.3)",
            "0 0 0 0 rgba(255, 255, 255, 0)",
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ borderRadius: "inherit" }}
      />
    </motion.div>
  );
};

export default DirtSpot;
