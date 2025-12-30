import { useEffect, useState } from 'react';

export default function useResponsiveBubble(pageKey = 'default') {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 480);
      setIsTablet(width >= 480 && width < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const config = {
    //atur bubble homepage (pageKey=default)
    default: {
      position: isMobile
        ? { bottom: '2rem', right: '5rem' }
        : isTablet
        ? { top: '45%', right: '2rem' }
        : { top: '50%', right: '4rem', translateY: '-50%' },
      motionConfig: {
        xInput: [0, 0.1, 0.3, 0.7, 1],
        xOutput: isMobile
          ? [280, 50, 280, 280, 300]
          : isTablet
          ? [100, -100, -50, 50, -80]
          : [470, -400, 550, 450, 500],
        yInput: [0, 0.1, 0.3, 0.7, 1],
        yOutput: isMobile
          ? [700, 400, 500, 600, 580]
          : isTablet
          ? [250, 250, 220, 210, 260]
          : [300, 300, 200, 300, 400],
        scaleInput: [0, 0.1, 0.3, 0.7, 1],
        scaleOutput: isMobile
          ? [0.6, 0.5, 0.7, 0.6, 0.7]
          : isTablet
          ? [1, 0.9, 1.5, 0.9, 1]
          : [1, 0.5, 1, 1, 1.3],
      },
    },

    //atur bubble di about (pageKey=about)
    about: {
      position: isMobile
        ? { top: '50%', left: '50%' }
        : isTablet
        ? { top: '45%', right: '2rem' }
        : { top: '10%', right: '4rem', translateY: '-50%' },
      motionConfig: {
        xInput: [0, 0.1, 0.3, 0.7, 1], //persantase scroll
        xOutput: isMobile
          ? [70, -100, 300, 0, 70]
          : isTablet
          ? [100, -100, -50, 50, -80]
          : [50, -900, 1000, -900, -135],
        yInput: [0, 0.1, 0.3, 1], //persantase scroll
        yOutput: isMobile
          ? [-300, -250, 400, 30]
          : isTablet
          ? [250, 250, 220, 260]
          : [100, 150, 100, 300],
        scaleInput: [0, 0.1, 0.3, 0.7, 1], //persantase scroll
        scaleOutput: isMobile
          ? [0.7, 0.8, 0.8, 0.8, 0.7]
          : isTablet
          ? [1, 0.9, 1.5, 0.9, 1]
          : [1, 1, 1, 1, 1.3],
      },
    },

    contact: {
      position: isMobile
        ? { bottom: '5rem', right: '1rem' }
        : isTablet
        ? { top: '45%', right: '2rem' }
        : { top: '10%', right: '4rem', translateY: '-50%' },
      motionConfig: {
        xInput: [0, 0.1, 0.3, 0.7, 1], //persantase scroll
        xOutput: isMobile
          ? [0, -300, 0, 80, 0]
          : isTablet
          ? [100, -100, -50, 50, -80]
          : [-150, -900, -1000, -500, -80],
        yInput: [0, 0.1, 0.3, 1], //persantase scroll
        yOutput: isMobile
          ? [-500, -400, -300, -90]
          : isTablet
          ? [250, 250, 220, 260]
          : [100, 200, 400, 360],
        scaleInput: [0, 0.1, 0.3, 0.7, 1], //persantase scroll
        scaleOutput: isMobile
          ? [0.7, 0.8, 0.5, 0.8, 0.8]
          : isTablet
          ? [1, 0.9, 1.5, 0.9, 1]
          : [1, 0.5, 1.5, 0.5, 1],
      },
    },

    portfolio: {
      position: isMobile
        ? { top: '50%', left: '50%' }
        : isTablet
        ? { top: '45%', right: '2rem' }
        : { top: '50%', left: '50%' },
      motionConfig: {
        xInput: [0, 0.2, 0.4, 0.6, 0.8, 1],
        xOutput: isMobile
          ? [70, 50, 50, 300, 50, 70]
          : isTablet
          ? [100, -100, -50, 50, -80, 0]
          : [-300, 100, 550, 900, 100, 300],
        yInput: [0, 0.2, 0.4, 0.6, 0.8, 1],
        yOutput: isMobile
          ? [-390, -390, 400, 400, -400, -30]
          : isTablet
          ? [250, 250, 220, 210, 260, 0]
          : [-180, -400, 200, -200, -199, -30],
        scaleInput: [0, 0.2, 0.4, 0.6, 0.8, 1],
        scaleOutput: isMobile
          ? [0.45, 0.5, 0.7, 0.6, 0.7, 0.7]
          : isTablet
          ? [1, 0.9, 1.5, 0.9, 1, 1]
          : [0.5, 0.6, 0.7, 0.6, 0.7, 1.3],
      },
    },

    project: {
      position: isMobile
        ? { top: '50%', left: '50%' }
        : isTablet
        ? { top: '45%', right: '2rem' }
        : { top: '10%', right: '4rem', translateY: '-50%' },
      motionConfig: {
        xInput: [0, 0.1, 0.3, 0.7, 1], //persantase scroll
        xOutput: isMobile
          ? [70, -100, 300, 0, 70]
          : isTablet
          ? [100, -100, -50, 50, -80]
          : [50, -900, 1000, -900, -135],
        yInput: [0, 0.1, 0.3, 1], //persantase scroll
        yOutput: isMobile
          ? [-300, -250, -400, 30]
          : isTablet
          ? [250, 250, 220, 260]
          : [100, 150, 100, 300],
        scaleInput: [0, 0.1, 0.3, 0.7, 1], //persantase scroll
        scaleOutput: isMobile
          ? [0.5, 0.6, 0.8, 0.5, 0.5]
          : isTablet
          ? [1, 0.9, 1.5, 0.9, 1]
          : [1, 1, 1, 1, 1.3],
      },
    },
    // Tambahkan konfigurasi untuk halaman lain di sini dengan tambahkan pageKey, pasang const { position, motionConfig } = useResponsiveBubble(misal'about'); di page masing-masing.
  };

  return config[pageKey] || config.default;
}
