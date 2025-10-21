import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useActiveAquarium } from '@/store/active-aquarium';
import { ArrowLeft, Construction } from 'lucide-react';

interface UnderConstructionProps {
  pageName: string;
  description: string;
}

export function UnderConstruction({ pageName, description }: UnderConstructionProps) {
  const navigate = useNavigate();
  const { activeAquariumId } = useActiveAquarium();

  const handleBackToAquarium = () => {
    if (activeAquariumId) {
      navigate(`/game?aquarium=${activeAquariumId}`);
    } else {
      navigate('/game');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>
      
      {/* Content with blur */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Construction Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto bg-blue-600/20 rounded-full flex items-center justify-center border-2 border-blue-400/30">
              <Construction className="w-12 h-12 text-blue-300" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {pageName}
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-blue-800/30 border border-blue-600/30 rounded-full px-4 py-2 text-blue-200 text-sm">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              Under Construction
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-blue-100 text-lg md:text-xl leading-relaxed mb-8 max-w-lg mx-auto"
          >
            {description}
          </motion.p>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={handleBackToAquarium}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Aquarium
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}