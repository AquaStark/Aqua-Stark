import { motion } from "framer-motion";
import { FoodType } from "@/types/game";

interface FoodProps {
  food: FoodType;
}

export function Food({ food }: FoodProps) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${food.position.x}%`,
      }}
      initial={{ top: `${food.position.y}%`, opacity: 0, scale: 0 }}
      animate={{ top: "90%", opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        duration: 10,
        ease: "easeInOut",
      }}
    >
      <div className="relative">
        <img
          src="/items/basic-food.png"
          alt="Fish Food"
          width={20}
          height={20}
          className="drop-shadow-lg"
        />
    
        <div
          className="absolute inset-0 rounded-full opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%)",
            transform: "scale(1.4)",
          }}
        />
      </div>
    </motion.div>
  );
}
