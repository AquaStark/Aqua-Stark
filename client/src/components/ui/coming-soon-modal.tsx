import React, { useEffect, useState } from 'react';
import { X, Construction, Fish, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  className?: string;
  closable?: boolean;
}

export function ComingSoonModal({
  isOpen,
  onClose,
  title = 'Coming Soon',
  description = 'This feature is currently under development. Stay tuned for exciting updates!',
  className,
  closable = false,
}: ComingSoonModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleGoBack = () => {
    navigate('/game');
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      {/* Backdrop con blur - no clickeable si no es cerrable */}
      <div
        className={cn(
          'absolute inset-0 backdrop-blur-md',
          closable ? 'bg-black/30 cursor-pointer' : 'bg-black/30'
        )}
        onClick={closable ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className='relative bg-gradient-to-br from-blue-600/95 via-blue-700/95 to-blue-800/95 backdrop-blur-lg border-2 border-blue-400/60 rounded-3xl p-10 max-w-2xl w-full mx-6 shadow-2xl'
        role='dialog'
        aria-labelledby='modal-title'
        aria-describedby='modal-description'
      >
        {/* Close button - only if closable */}
        {closable && (
          <button
            onClick={onClose}
            className='absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10'
            aria-label='Close modal'
          >
            <X className='w-7 h-7' aria-hidden='true' />
          </button>
        )}

        {/* Contenido */}
        <div className='text-center space-y-8'>
          {/* Iconos animados */}
          <div className='relative'>
            <div className='flex justify-center items-center space-x-6 mb-6'>
              <Construction className='w-16 h-16 text-yellow-400 animate-pulse' />
              <div className='relative'>
                <Fish className='w-16 h-16 text-blue-300 animate-bounce' />
                <Sparkles className='absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-ping' />
              </div>
              <Construction className='w-16 h-16 text-yellow-400 animate-pulse' />
            </div>

            {/* Efecto de ondas mejorado */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='w-32 h-32 border-2 border-blue-300/40 rounded-full animate-ping' />
              <div
                className='absolute w-24 h-24 border-2 border-blue-400/60 rounded-full animate-ping'
                style={{ animationDelay: '0.5s' }}
              />
              <div
                className='absolute w-16 h-16 border-2 border-blue-500/80 rounded-full animate-ping'
                style={{ animationDelay: '1s' }}
              />
            </div>
          </div>

          {/* Título */}
          <div className='space-y-3'>
            <h2 className='text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent'>
              {title}
            </h2>

            {/* Línea decorativa */}
            <div className='flex justify-center'>
              <div className='w-20 h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent rounded-full' />
            </div>
          </div>

          {/* Descripción */}
          <p className='text-white/90 text-lg leading-relaxed max-w-lg mx-auto'>
            {description}
          </p>

          {/* Botón de regresar - siempre visible */}
          <div className='pt-4'>
            <Button
              onClick={handleGoBack}
              className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl border border-blue-400/50'
            >
              <Sparkles className='w-5 h-5 mr-2' />
              Back to Game
            </Button>
          </div>
        </div>

        {/* Efectos decorativos mejorados */}
        <div className='absolute -top-3 -left-3 w-6 h-6 bg-blue-400/60 rounded-full animate-pulse' />
        <div
          className='absolute -bottom-3 -right-3 w-5 h-5 bg-blue-300/60 rounded-full animate-pulse'
          style={{ animationDelay: '1s' }}
        />
        <div
          className='absolute top-1/2 -left-6 w-3 h-3 bg-blue-400/40 rounded-full animate-pulse'
          style={{ animationDelay: '0.5s' }}
        />
        <div
          className='absolute top-1/2 -right-6 w-3 h-3 bg-blue-300/40 rounded-full animate-pulse'
          style={{ animationDelay: '1.5s' }}
        />

        {/* Efectos de esquina */}
        <div className='absolute top-4 left-4 w-2 h-2 bg-yellow-400/60 rounded-full animate-pulse' />
        <div
          className='absolute bottom-4 right-4 w-2 h-2 bg-yellow-400/60 rounded-full animate-pulse'
          style={{ animationDelay: '0.7s' }}
        />
      </div>
    </div>
  );
}
