// Nama file: Wave.js
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState, useId } from 'react';

// ... (Preset dan hook useBreakpoint tidak berubah)
const waveBehaviors = {
  default: {
    inputRange: [0, 0.3, 0.5, 0.8, 1],
    outputRange: [100, 150, 50, 150, 100],
  },
  calm: { inputRange: [0, 0.5, 1], outputRange: [100, 130, 100] },
  energetic: {
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [120, 20, 180, 20, 180, 120],
  },
  flat: { inputRange: [0, 1], outputRange: [100, 100] },
};

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

const resolveResponsiveProp = (prop, breakpoint) => {
  if (typeof prop === 'object' && prop !== null) {
    if (breakpoint === 'tablet' && 'tablet' in prop) return prop.tablet;
    if (breakpoint === 'mobile' && 'mobile' in prop) return prop.mobile;
    if ('desktop' in prop) return prop.desktop;
  }
  return prop;
};

const Wave = ({
  config,
  colors = ['#8b5cf6', '#3b82f6'],
  targetRef,
  className,
}) => {
  // ... (Semua setup awal props responsif tidak berubah)
  const breakpoint = useBreakpoint();
  const gradientId = useId();
  const blurId = useId();
  const initialY = resolveResponsiveProp(config.initialY, breakpoint);
  const finalY = resolveResponsiveProp(config.finalY, breakpoint);
  const topWavePreset = resolveResponsiveProp(
    config.topWave.wavePreset,
    breakpoint
  );
  const topControlPoints = resolveResponsiveProp(
    config.topWave.controlPoints,
    breakpoint
  );
  const bottomWavePreset = resolveResponsiveProp(
    config.bottomWave.wavePreset,
    breakpoint
  );
  const bottomControlPoints = resolveResponsiveProp(
    config.bottomWave.controlPoints,
    breakpoint
  );

  // PERHATIAN: Prop springConfig tidak lagi digunakan, namun kita biarkan untuk kompatibilitas
  const springConfig = config.springConfig || { stiffness: 100, damping: 20 };

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: targetRef ? ['start end', 'end start'] : ['start start', 'end end'],
  });

  // Bagian ini tidak lagi menggunakan useSpring
  const topBehavior = waveBehaviors[topWavePreset] || waveBehaviors.default;
  const topControlY = useTransform(
    scrollYProgress,
    topBehavior.inputRange,
    topControlPoints
  );
  // HAPUS: const smoothTopControlY = useSpring(topControlY, springConfig);

  const bottomBehavior =
    waveBehaviors[bottomWavePreset] || waveBehaviors.default;
  const bottomControlY = useTransform(
    scrollYProgress,
    bottomBehavior.inputRange,
    bottomControlPoints
  );
  // HAPUS: const smoothBottomControlY = useSpring(bottomControlY, springConfig);

  // PERUBAHAN 1: Hapus useSpring dari variabel 'y'
  const y = useTransform(scrollYProgress, [0, 1], [initialY, finalY]);

  // PERUBAHAN 2: Gunakan 'motion value' asli (topControlY, bottomControlY)
  const d = useTransform(
    [topControlY, bottomControlY], // Ganti dari [smoothTopControlY, smoothBottomControlY]
    ([topCy, bottomCy]) =>
      `M 0 50 Q 500 ${topCy} 1000 50 L 1000 550 Q 500 ${bottomCy} 0 550 Z` //`M 0 50 Q 500 ${topCy} 1000 50 L 1000 550 Q 500 ${bottomCy} 0 550 Z`
  );

  return (
    <motion.svg
      className={`wave ${className || ''}`}
      viewBox='0 0 1000 700'
      preserveAspectRatio='none'
      xmlns='http://www.w3.org/2000/svg'
      style={{
        y, // 'y' sekarang adalah motion value biasa, bukan dari useSpring
        width: '100%',
        height: '100vh',
        position: 'Absolute',
        left: 0,
        top: 0,
        zIndex: -1,
      }}>
      {/* ... (definisi <defs> dan <path> tetap sama) ... */}
      <defs>
        <linearGradient
          id={gradientId}
          x1='0%'
          y1='0%'
          x2='100%'
          y2='100%'>
          <stop
            offset='0%'
            stopColor={colors[0]}
          />
          <stop
            offset='100%'
            stopColor={colors[1]}
          />
        </linearGradient>
        <filter id={blurId}>
          <feGaussianBlur
            in='SourceGraphic'
            stdDeviation='20'
          />
        </filter>
      </defs>
      <motion.path
        d={d}
        fill='rgba(0, 0, 0, 0.3)'
        filter={`url(#${blurId})`}
        style={{ y: 50 }}
      />
      <motion.path
        d={d}
        fill={`url(#${gradientId})`}
      />
    </motion.svg>
  );
};

export default Wave;
