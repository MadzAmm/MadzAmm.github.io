// import React, { useRef } from 'react';
// import { motion, useScroll, useTransform } from 'framer-motion';
// import './StickyTextMerge.scss';

// // --- Variabel Konfigurasi ---
// const initialBackgroundColor = '#0a0a0a';
// const finalBackgroundColor = '#FFF7ED';
// const madzamTextColor = '#002f45';

// const StickyTextMerge = () => {
//   const targetRef = useRef(null);
//   const { scrollYProgress } = useScroll({
//     target: targetRef,
//     offset: ['start start', 'end end'],
//   });

//   // --- Animasi Teks "HERE I AM" (Tidak berubah) ---
//   const xTop = useTransform(scrollYProgress, [0, 0.4], ['-100%', '0%']);
//   const xBottom = useTransform(scrollYProgress, [0, 0.4], ['100%', '0%']);
//   const yTop = useTransform(scrollYProgress, [0.4, 0.6], ['0%', '80%']);
//   const yBottom = useTransform(scrollYProgress, [0.4, 0.6], ['0%', '-80%']);
//   const sideLinesOpacity = useTransform(scrollYProgress, [0.55, 0.6], [1, 0]);
//   const middleScale = useTransform(scrollYProgress, [0.6, 0.8], [1, 25]);

//   // ✅ --- HAPUS LOGIKA INI --- ✅
//   // const middleOpacity = useTransform(
//   //   scrollYProgress,
//   //   [0.75, 0.8],
//   //   [1, 0]
//   // );

//   // --- Animasi Latar Belakang & Teks "Madzam" (Tidak berubah) ---
//   const backgroundColor = useTransform(
//     scrollYProgress,
//     [0.7, 0.8],
//     [initialBackgroundColor, finalBackgroundColor]
//   );
//   const madzamOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
//   const madzamScale = useTransform(scrollYProgress, [0.8, 0.9], [0.8, 1]);

//   return (
//     <section
//       ref={targetRef}
//       className='text-merge-section'>
//       <div className='sticky-wrapper'>
//         <motion.div
//           className='animated-background'
//           style={{ backgroundColor }}
//         />
//         <motion.h1
//           className='text-line top'
//           style={{ x: xTop, y: yTop, opacity: sideLinesOpacity }}>
//           HERE I AM
//         </motion.h1>

//         {/* ✅ HAPUS `opacity` DARI STYLE DI BAWAH INI */}
//         <motion.h1
//           className='text-line middle'
//           style={{
//             scale: middleScale,
//             // opacity: middleOpacity, // <-- Hapus baris ini
//           }}>
//           HERE I AM
//         </motion.h1>

//         <motion.h1
//           className='text-line bottom'
//           style={{ x: xBottom, y: yBottom, opacity: sideLinesOpacity }}>
//           HERE I AM
//         </motion.h1>

//         <motion.h1
//           className='text-line madzam'
//           style={{
//             opacity: madzamOpacity,
//             scale: madzamScale,
//             color: madzamTextColor,
//           }}>
//           마드잠
//         </motion.h1>
//       </div>
//     </section>
//   );
// };

// export default StickyTextMerge;

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './StickyTextMerge.scss';

// --- Variabel Konfigurasi Warna ---
const initialBackgroundColor = '#0a0a0a';
const finalBackgroundColor = '#FFF7ED';
const madzamTextColor = '#002f45';

// --- PANEL KONTROL ANIMASI RESPONSIVE ---
const animationConfig = {
  mobile: {
    textTop: 'HERE I AM',
    textMiddle: 'HERE I AM',
    textBottom: 'HERE I AM',
    textNew: '무함마드',
    middleScale: [1, 120],
    yTravel: '120%',
    xTopStart: '-120%',
    xBottomStart: '120%',
  },
  tablet: {
    textTop: 'HERE I AM',
    textMiddle: 'HERE I AM',
    textBottom: 'HERE I AM',
    textNew: '무함마드',
    middleScale: [1, 81],
    yTravel: '100%',
    xTopStart: '-120%',
    xBottomStart: '120%',
  },
  desktop: {
    textTop: 'HERE I AM',
    textMiddle: 'HERE I AM',
    textBottom: 'HERE I AM',
    textNew: '무함마드',
    middleScale: [1, 29],
    yTravel: '100%',
    xTopStart: '-115%',
    xBottomStart: '115%',
  },
};

// --- Fungsi Helper untuk Breakpoint ---
const getBreakpoint = (width) => {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

const StickyTextMerge = () => {
  // ✅ --- LOGIKA BREAKPOINT SEKARANG ADA DI SINI --- ✅
  const [breakpoint, setBreakpoint] = useState(() =>
    getBreakpoint(window.innerWidth)
  );

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Dependensi kosong agar hanya berjalan sekali saat komponen dimuat

  // --- Sisa Komponen (Tidak ada yang berubah) ---
  const targetRef = useRef(null);
  const config = animationConfig[breakpoint];

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  const xTop = useTransform(
    scrollYProgress,
    [0, 0.4],
    [config.xTopStart, '0%']
  );
  const xBottom = useTransform(
    scrollYProgress,
    [0, 0.4],
    [config.xBottomStart, '0%']
  );
  const yTop = useTransform(
    scrollYProgress,
    [0.4, 0.6],
    ['0%', config.yTravel]
  );
  const yBottom = useTransform(
    scrollYProgress,
    [0.4, 0.6],
    ['0%', `-${config.yTravel}`]
  );
  const sideLinesOpacity = useTransform(scrollYProgress, [0.6, 0.62], [1, 0]);
  const middleScale = useTransform(
    scrollYProgress,
    [0.63, 0.8],
    config.middleScale
  );
  const backgroundColor = useTransform(
    scrollYProgress,
    [0.7, 0.8],
    [initialBackgroundColor, finalBackgroundColor]
  );
  const madzamOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const madzamScale = useTransform(scrollYProgress, [0.8, 0.9], [0.8, 1]);

  return (
    <section
      ref={targetRef}
      className='text-merge-section'>
      <div className='sticky-wrapper'>
        <motion.div
          className='animated-background'
          style={{ backgroundColor }}
        />

        {config.textTop && (
          <motion.h1
            className='text-line top'
            style={{ x: xTop, y: yTop, opacity: sideLinesOpacity }}>
            {config.textTop}
          </motion.h1>
        )}
        <motion.h1
          className='text-line middle'
          style={{ scale: middleScale }}>
          {config.textMiddle}
        </motion.h1>
        {config.textBottom && (
          <motion.h1
            className='text-line bottom'
            style={{ x: xBottom, y: yBottom, opacity: sideLinesOpacity }}>
            {config.textBottom}
          </motion.h1>
        )}
        <motion.h1
          className='text-line madzam'
          style={{
            opacity: madzamOpacity,
            scale: madzamScale,
            color: madzamTextColor,
          }}>
          {config.textNew}
        </motion.h1>
      </div>
    </section>
  );
};

export default StickyTextMerge;
