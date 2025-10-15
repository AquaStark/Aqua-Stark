import { useState, useEffect } from 'react';

interface MobileDetection {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
}

export function useMobileDetection(): MobileDetection {
  const [detection, setDetection] = useState<MobileDetection>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 0,
    screenHeight: 0,
    userAgent: '',
  });

  useEffect(() => {
    const updateDetection = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent.toLowerCase();

      // Detectar dispositivos móviles por user agent
      const mobileRegex =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const tabletRegex = /ipad|android(?!.*mobile)|tablet/i;

      const isMobileUA = mobileRegex.test(userAgent);
      const isTabletUA = tabletRegex.test(userAgent);

      // Detectar por tamaño de pantalla
      const isMobileScreen = width <= 768;
      const isTabletScreen = width > 768 && width <= 1024;

      // Combinar detección por user agent y tamaño de pantalla
      const isMobile = isMobileUA || (isMobileScreen && !isTabletUA);
      const isTablet = isTabletUA || (isTabletScreen && !isMobileUA);
      const isDesktop = !isMobile && !isTablet;

      setDetection({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        userAgent,
      });
    };

    // Detección inicial
    updateDetection();

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', updateDetection);
    window.addEventListener('orientationchange', updateDetection);

    return () => {
      window.removeEventListener('resize', updateDetection);
      window.removeEventListener('orientationchange', updateDetection);
    };
  }, []);

  return detection;
}
