import { motion } from 'framer-motion';
import { ArrowLeft, Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UnderConstructionProps {
  pageName: string;
  description?: string;
}

export function UnderConstruction({ 
  pageName, 
  description = "We're building something incredible under the water! We expect to have it ready soon." 
}: UnderConstructionProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Navigate back to game with aquarium ID preserved
    const urlParams = new URLSearchParams(window.location.search);
    const aquariumId = urlParams.get('aquarium');
    
    if (aquariumId) {
      navigate(`/game?aquarium=${aquariumId}`);
    } else {
      navigate('/game');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-blue-400/30 shadow-2xl"
      >
        {/* Construction Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Construction className="w-10 h-10 text-white" />
            </div>
            {/* Animated bubbles */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full opacity-70"
            />
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-1 -left-1 w-3 h-3 bg-cyan-400 rounded-full opacity-60"
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white mb-2">
            {pageName}
          </h2>
          
          <p className="text-blue-200 text-sm leading-relaxed">
            {description}
          </p>

          {/* Animated underwater effect */}
          <div className="flex justify-center space-x-1 mt-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
                className="text-2xl"
              >
                🐠
              </motion.div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoBack}
          className="w-full mt-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Aquarium
        </motion.button>
      </motion.div>
    </div>
  );
}
