import { motion, AnimatePresence } from "framer-motion";
import { FoodType } from "@/types/game";

interface FoodProps {
  food: FoodType;
  isEaten?: boolean;
}

export function Food({ food, isEaten = false }: FoodProps) {
  // Immediately return null if food is eaten
  if (isEaten) return null;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${food.position.x}%`,
        top: `${food.position.y}%`,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: "90%"
      }}
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
