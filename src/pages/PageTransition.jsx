// import { motion, AnimatePresence } from 'framer-motion';
// import { useEffect, useState } from 'react';
// import './PageTransition.scss';

// export default function PageTransition({ label = '', children }) {
//   const [phase, setPhase] = useState('enter');
//   const [showContent, setShowContent] = useState(false);
//   const [typedLabel, setTypedLabel] = useState('');

//   useEffect(() => {
//     const timers = [
//       setTimeout(() => setPhase('hold'), 800),
//       setTimeout(() => setPhase('exit'), 1600),
//       setTimeout(() => setShowContent(true), 2200),
//     ];
//     return () => timers.forEach(clearTimeout);
//   }, []);

//   useEffect(() => {
//     if (phase !== 'hold' || !label || typeof label !== 'string') return;

//     setTypedLabel('');
//     let index = 0;

//     const typing = setInterval(() => {
//       const nextChar = label.charAt(index);
//       setTypedLabel((prev) => prev + nextChar);
//       index++;

//       if (index >= label.length) {
//         clearInterval(typing);
//       }
//     }, 85);

//     return () => clearInterval(typing);
//   }, [phase, label]);

//   const variants = {
//     enter: {
//       clipPath: 'circle(500px at 50% 200%)',
//       //   scale: 0.95,
//       filter: 'blur(0px)',
//       opacity: 1,
//       transition: {
//         stiffness: 100,
//         type: 'spring',
//         damping: 4,
//       },
//     },
//     hold: {
//       clipPath: 'circle(3000px at 100% 100%)',
//       //   scale: 1,
//       filter: 'blur(0px)',
//       opacity: 1,
//       transition: { stiffness: 20, type: 'spring' },
//     },
//     exit: {
//       clipPath: 'circle(1000px at 50% -200%)',

//       // scale: 0.95,
//       filter: 'blur(0px)',
//       opacity: 1,
//       transition: {
//         stiffness: 25,
//         type: 'spring',
//       },
//     },
//   };

//   return (
//     <>
//       <AnimatePresence>
//         {phase !== 'done' && (
//           <motion.div
//             className='page-transition'
//             variants={variants}
//             initial='enter'
//             animate={phase}
//             exit='exit'>
//             <motion.div className='page-label'>{typedLabel}</motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {showContent && (
//         <motion.div
//           className='page-content'
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ y: -50, opacity: 0 }}>
//           {children}
//         </motion.div>
//       )}
//     </>
//   );
// }
//
//
//
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import './PageTransition.scss';

export default function PageTransition({ label = '', children }) {
  const [phase, setPhase] = useState('enter');
  const [showContent, setShowContent] = useState(false);
  const [typedLabel, setTypedLabel] = useState('');
  const exitTransitionConfig = {
    type: 'tween',
    // ease: 'backIn', // Atau coba [0.64, 0, 0.78, 0] untuk Opsi 1
    // ease: [0.64, 0, 0.78, 0],
    ease: [0.36, 0.8, 0.36, 0.7], // Opsi 2: easeInOut yang lebih halus

    duration: 0.65,
  };

  useEffect(() => {
    if (typeof window !== 'undefined') window.scrollTo(0, 0);

    // KONFIGURASI WAKTU (Dalam Milidetik) ---
    const ENTER_DURATION = 200; // Waktu lingkaran menutup (Hitam muncul)
    const HOLD_DURATION = 1500; // 🔥 UBAH INI: Lama diam di layar hitam (misal 2.5 detik)
    const EXIT_ANIMATION = 700; // Waktu yang dibutuhkan animasi exit untuk selesai
    // ---------------------------------------------

    // Kalkulasi Otomatis (Jangan diubah biar tetap selaras)
    const startHold = ENTER_DURATION;
    const startExit = startHold + HOLD_DURATION;
    const revealContent = startExit + EXIT_ANIMATION;

    const timers = [
      setTimeout(() => setPhase('hold'), startHold),
      setTimeout(() => setPhase('exit'), startExit),
      setTimeout(() => setShowContent(true), revealContent),
    ];

    return () => timers.forEach(clearTimeout);
  }, []); // Dependency array kosong []

  // --- LOGIKA TYPING (Biar ngetiknya agak santai menyesuaikan hold lama) ---
  useEffect(() => {
    if (phase !== 'hold' || !label) return;

    setTypedLabel('');
    let index = 0;

    // Opsional: Kalau hold lama, speed ngetik bisa diperlambat (misal 100ms)
    // atau biarkan cepat (85ms) biar ada jeda baca setelah selesai ngetik.
    const typingSpeed = 100;

    const typing = setInterval(() => {
      const nextChar = label.charAt(index);
      setTypedLabel((prev) => prev + nextChar);
      index++;
      if (index >= label.length) clearInterval(typing);
    }, typingSpeed);

    return () => clearInterval(typing);
  }, [phase, label]);

  // --- VARIANTS (Tetap sama) ---
  const containerVariants = {
    enter: {
      clipPath: 'circle(500px at 50% 200%)',
      filter: 'blur(0px)',
      opacity: 1,
      transition: exitTransitionConfig,
    },
    hold: {
      clipPath: 'circle(3000px at 100% 100%)',
      filter: 'blur(0px)',
      opacity: 1,
      transition: { stiffness: 20, type: 'spring' },
    },
    exit: {
      clipPath: 'circle(1000px at 50% -200%)',
      filter: 'blur(0px)',
      opacity: 1,
      transition: exitTransitionConfig,
    },
  };

  const labelVariants = {
    enter: { opacity: 1, y: 0 },
    hold: { opacity: 1, y: 0 },
    exit: {
      opacity: 0,
      y: -100, // Label naik ke atas bersamaan dengan exit
      transition: { duration: 0.4, ease: 'easeInOut' }, // Durasi label hilang lebih cepat dikit dari exit
    },
  };

  return (
    <>
      <AnimatePresence>
        {phase !== 'done' && !showContent && (
          <motion.div
            className='page-transition'
            variants={containerVariants}
            initial='enter'
            animate={phase}
            exit='exit'
            style={{ zIndex: 9999 }}>
            <motion.div
              className='page-label'
              variants={labelVariants}>
              {typedLabel}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showContent && (
        <motion.div
          className='page-content'
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}>
          {children}
        </motion.div>
      )}
    </>
  );
}
