import { useState, useEffect } from 'react';
import { Maximize, X, Smartphone, Monitor } from 'lucide-react';
import { Button } from './button';
import { useFullscreen } from '@/hooks/use-fullscreen';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function FullscreenModal({ isOpen, onClose, onAccept }: FullscreenModalProps) {
  const { isSupported, isEnabled } = useFullscreen();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(mobile);
    };
    checkMobile();
  }, []);

  if (!isOpen || !isSupported || !isEnabled) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 max-w-md w-full border border-blue-400/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {isMobile ? (
              <Smartphone className="h-8 w-8 text-blue-300" />
            ) : (
              <Monitor className="h-8 w-8 text-blue-300" />
            )}
            <h2 className="text-2xl font-bold text-white">
              {isMobile ? 'Pantalla Completa' : 'Full Screen'}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-blue-700/50"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <p className="text-blue-100 text-lg leading-relaxed">
            {isMobile ? (
              <>
                Para la mejor experiencia de juego, te recomendamos usar la aplicación en{' '}
                <span className="text-blue-300 font-semibold">pantalla completa</span>.
                <br /><br />
                Esto ocultará las barras del navegador y te dará más espacio para jugar.
              </>
            ) : (
              <>
                Para la mejor experiencia de juego, te recomendamos usar la aplicación en{' '}
                <span className="text-blue-300 font-semibold">pantalla completa</span>.
                <br /><br />
                Esto maximizará el área de juego y ocultará las barras del navegador.
              </>
            )}
          </p>

          <div className="bg-blue-800/50 rounded-lg p-4 border border-blue-600/30">
            <div className="flex items-center gap-2 text-blue-200">
              <Maximize className="h-5 w-5" />
              <span className="font-medium">
                {isMobile ? 'Ocultará las barras del navegador' : 'Maximizará la ventana del juego'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-blue-400/50 text-blue-200 hover:bg-blue-700/50"
          >
            {isMobile ? 'Ahora no' : 'Not now'}
          </Button>
          <Button
            onClick={onAccept}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold"
          >
            {isMobile ? 'Activar' : 'Activate'}
          </Button>
        </div>

        {/* Footer note */}
        <p className="text-blue-300/70 text-sm text-center mt-4">
          {isMobile ? 'Puedes cambiar esto más tarde desde el menú' : 'You can change this later from the menu'}
        </p>
      </div>
    </div>
  );
}
