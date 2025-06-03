import { motion, AnimatePresence } from "framer-motion";
import { FoodType } from "@/types/game";

interface FoodProps {
  food: FoodType;
  isEaten?: boolean;
}

export function Food({ food, isEaten = false }: FoodProps) {
  return (
    <AnimatePresence>
      {!isEaten && (
        <motion.div
          className="absolute"
          style={{
            left: `${food.position.x}%`,
          }}
          initial={{ top: `${food.position.y}%`, opacity: 0, scale: 0.5 }}
          animate={{ top: "90%", opacity: 1, scale: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 0.8,
            transition: {
              duration: 0.3,
              ease: "easeOut"
            }
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
            
            {/* Eating effect */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1, opacity: 0 }}
              animate={isEaten ? { scale: 2, opacity: 0 } : { scale: 1, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full h-full rounded-full bg-yellow-300/30" />
            </motion.div>
            
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
      )}
    </AnimatePresence>
  );
}
