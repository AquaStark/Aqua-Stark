import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useActiveAquarium } from '@/store/active-aquarium';
import { ArrowLeft, Construction } from 'lucide-react';

interface UnderConstructionProps {
  pageName: string;
  description: string;
  children?: React.ReactNode;
}

export function UnderConstruction({ pageName, description, children }: UnderConstructionProps) {
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
    <div className="relative min-h-screen">
      {/* Page content in background (lightly blurred) */}
      <div className="absolute inset-0 blur-sm pointer-events-none opacity-70">
        {children}
      </div>

      {/* Overlay with modal */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-blue-900/95 border border-blue-600/50 rounded-2xl p-8 max-w-lg w-full shadow-2xl"
        >
          {/* Construction Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6 flex justify-center"
          >
            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center border-2 border-blue-400/30">
              <Construction className="w-10 h-10 text-blue-300" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-3 text-center"
          >
            {pageName}
          </motion.h2>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6 flex justify-center"
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
            transition={{ delay: 0.5 }}
            className="text-blue-100 text-base leading-relaxed mb-8 text-center"
          >
            {description}
          </motion.p>

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleBackToAquarium}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Aquarium
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}