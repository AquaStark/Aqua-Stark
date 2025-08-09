'use client';

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BubblesBackground } from '@/components/bubble-background';
import { useBubbles } from '@/hooks/use-bubbles';
import { creditsData } from '@/data/mock-credits';

export default function Credits() {
  const navigate = useNavigate();
  const bubbles = useBubbles();
  const [showLogo, setShowLogo] = useState(false);
  const creditsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let hasTriggered = false;

    const checkScrollEnd = () => {
      if (creditsRef.current && !hasTriggered) {
        const lastElement = creditsRef.current.lastElementChild as HTMLElement;

        if (lastElement) {
          const lastElementRect = lastElement.getBoundingClientRect();

          if (lastElementRect.bottom < 0) {
            hasTriggered = true;

            setTimeout(() => {
              setShowLogo(true);
            }, 200);
          }
        }
      }
    };

    const interval = setInterval(checkScrollEnd, 100);
    return () => clearInterval(interval);
  }, []);

  const handleBackToMain = () => {
    navigate('/');
  };

  return (
    <div className='relative h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900'>
      <BubblesBackground bubbles={bubbles} />

      <div className='absolute top-6 left-6 z-50'>
        <Button
          onClick={handleBackToMain}
          className='bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200'
          aria-label='Back to Main Menu'
        >
          <ArrowLeft className='w-4 h-4' aria-hidden='true' />
          Back to Main
        </Button>
      </div>

      <div className='relative z-20 h-screen flex items-center justify-center'>
        <motion.div
          className={`credits-container relative w-full max-w-2xl mx-auto px-4 ${showLogo ? 'opacity-0' : 'opacity-100'}`}
          ref={creditsRef}
          transition={{ duration: 1 }}
        >
          <div className='credits-content text-center text-white'>
            {creditsData.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: sectionIndex * 0.5,
                  staggerChildren: 0.2,
                }}
                className='mb-16'
              >
                <h2 className='text-3xl md:text-4xl font-bold mb-8 text-white'>
                  {section.title}
                </h2>

                <div className='space-y-4'>
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={`${section.title}-${itemIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: sectionIndex * 0.5 + itemIndex * 0.1,
                      }}
                      className='text-lg md:text-xl'
                    >
                      <span className='font-semibold'>{item.role}: </span>
                      <span className='text-white/90'>{item.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className='absolute inset-0 flex items-center justify-center pointer-events-none'
          initial={{ opacity: 0 }}
          animate={showLogo ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
          }}
        >
          <div className='text-center'>
            <img
              src='/logo/aqua-stark.png'
              alt='Aqua Stark'
              className='w-64 h-64 md:w-80 md:h-80 object-contain mx-auto'
            />
          </div>
        </motion.div>
      </div>

      <style>{`
        body {
          overflow: hidden;
        }
        
        .credits-container {
          animation: scrollCredits 20s linear forwards;
        }

        @keyframes scrollCredits {
          0% {
            transform: translateY(100vh);
          }
          100% {
            transform: translateY(-150vh);
          }
        }
      `}</style>
    </div>
  );
}
