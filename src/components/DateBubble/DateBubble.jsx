// // export default DateBubble;
// import { useEffect, useState, useRef } from 'react';
// import {
//   motion,
//   useMotionValue,
//   useMotionValueEvent,
//   useSpring,
//   useTransform,
//   animate,
//   useScroll,
// } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import useResponsiveBubble from './UseResponsiveBubble';

// import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// // --- Custom Hook: useMagneticBubble (Tidak Berubah) ---
// const useMagneticBubble = (ref, options = {}) => {
//   // ... (kode hook ini tidak berubah) ...
//   const {
//     pullForce = 0.6,
//     magneticThreshold = 120,
//     springConfig = { damping: 10, stiffness: 200 },
//   } = options;
//   const magneticX = useMotionValue(0);
//   const magneticY = useMotionValue(0);
//   const springX = useSpring(magneticX, springConfig);
//   const springY = useSpring(magneticY, springConfig);

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (!ref.current) return;
//       const { clientX, clientY } = e;
//       const { left, top, width, height } = ref.current.getBoundingClientRect();
//       const centerX = left + width / 2;
//       const centerY = top + height / 2;
//       const distance = Math.sqrt(
//         Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2)
//       );
//       if (distance < magneticThreshold) {
//         const moveX = (clientX - centerX) * pullForce;
//         const moveY = (clientY - centerY) * pullForce;
//         magneticX.set(moveX);
//         magneticY.set(moveY);
//       } else {
//         magneticX.set(0);
//         magneticY.set(0);
//       }
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, [ref, magneticX, magneticY, pullForce, magneticThreshold]);

//   return { x: springX, y: springY };
// };

// // --- Fungsi Helper untuk Format Waktu (Tidak Berubah) ---
// const formatDateParts = () => {
//   // ... (kode ini tidak berubah) ...
//   const now = new Date();
//   const hours = now.getHours().toString().padStart(2, '0');
//   const minutes = now.getMinutes().toString().padStart(2, '0');
//   const date = now.toLocaleString('en-US', {
//     month: 'short',
//     day: 'numeric',
//   });
//   return { date, hours, minutes };
// };

// // --- Komponen Utama: DateBubble ---
// const DateBubble = ({
//   mode = 'default',
//   motionConfig: externalMotionConfig,
//   customStages,
//   position: externalPosition,
//   x: externalX,
//   y: externalY,
//   scale: externalScale,
//   scrollYProgress: externalScrollYProgress,
//   navigate: externalNavigate,
// }) => {
//   // ... (Semua state dan ref awal tidak berubah) ...
//   const ref = useRef(null);
//   const navigate = externalNavigate || useNavigate();
//   const [timeParts, setTimeParts] = useState(formatDateParts());
//   const [hovered, setHovered] = useState(false);
//   const [stageIndex, setStageIndex] = useState(0);

//   const [isDragging, setIsDragging] = useState(false);
//   const isDraggingRef = useRef(false);
//   const dragOffsetX = useMotionValue(0);
//   const dragOffsetY = useMotionValue(0);

//   const justDragged = useRef(false);
//   const gestureState = useRef({
//     lastTapUpTime: 0,
//     holdTimeout: null,
//     isMagneticHold: false,
//     dragStartPos: { x: 0, y: 0 },
//   });

//   const touchBubbleMagneticX = useMotionValue(0);
//   const touchBubbleMagneticY = useMotionValue(0);
//   const springTouchBubbleMagneticX = useSpring(touchBubbleMagneticX, {
//     damping: 10,
//     stiffness: 200,
//   });
//   const springTouchBubbleMagneticY = useSpring(touchBubbleMagneticY, {
//     damping: 10,
//     stiffness: 200,
//   });
//   const touchTextMagneticX = useMotionValue(0);
//   const touchTextMagneticY = useMotionValue(0);
//   const springTouchTextMagneticX = useSpring(touchTextMagneticX, {
//     damping: 12,
//     stiffness: 180,
//   });
//   const springTouchTextMagneticY = useSpring(touchTextMagneticY, {
//     damping: 12,
//     stiffness: 180,
//   });

//   useEffect(() => {
//     isDraggingRef.current = isDragging;
//   }, [isDragging]);

//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ['start start', 'end end'],
//   });
//   const activeScroll = externalScrollYProgress || scrollYProgress;
//   const { position: defaultPosition, motionConfig: defaultMotionConfig } =
//     useResponsiveBubble();
//   const motionConfig = externalMotionConfig || defaultMotionConfig;
//   const bubblePosition = externalPosition || defaultPosition;

//   // --- LOGIKA STAGES (Tidak Berubah) ---
//   const defaultStages = [
//     {
//       // 1. Homepage
//       range: [0, 0.2],
//       text: '',
//       hoverText: 'date',
//       bg: 'rgba(0, 0, 0, 0.3)',
//       color: '#fff',
//       onClick: () => navigate('/'),
//       isHoverable: true,
//     },
//     {
//       // 2. About (Hoverable)
//       range: [0.2, 0.4],
//       text: 'About',
//       bg: '#0b60df33',
//       baseBg: '#002f45',
//       color: '#fff',
//       onClick: () => navigate('/about'),
//       isHoverable: true,
//     },
//     {
//       // 3. Projects
//       range: [0.4, 0.7],
//       text: 'Projects',
//       bg: 'rgba(32, 42, 68, 0.6)',
//       color: '#ffffffff',
//       isHoverable: false,
//     },
//     {
//       // 4. Archive (Contoh Lottie)
//       range: [0.7, 0.8],
//       text: '', // <-- DIKOSONGKAN UNTUK MENAMPILKAN LOTTIE
//       hoverText: 'Archive', // <-- Teks tetap muncul saat hover
//       bg: '#0b60df33',
//       baseBg: '#002f45',
//       color: '#fff',
//       onClick: () => navigate('/portfolio'),
//       isHoverable: true,
//     },
//     {
//       // 5. Sapere Aude
//       range: [0.8, 0.9],
//       text: 'Sapere aude_Kant',
//       bg: '#002f45',
//       color: 'cadetblue',
//       isHoverable: false,
//     },
//     {
//       // 6. Contact
//       range: [0.9, Infinity],
//       text: 'Get in Touch',
//       bg: '#0b60df33',
//       baseBg: '#002f45',
//       color: '#fff',
//       onClick: () => navigate('/contact'),
//       isHoverable: true,
//     },
//   ];

//   const activeStages =
//     mode === 'custom' && customStages ? customStages : defaultStages;

//   useMotionValueEvent(activeScroll, 'change', (latest) => {
//     const index = activeStages.findIndex(
//       ({ range }) => latest >= range[0] && latest < range[1]
//     );
//     if (index !== -1) {
//       setStageIndex(index);
//     }
//   });

//   // ... (useEffect untuk timeParts dan handleScroll tidak berubah) ...
//   useEffect(() => {
//     const interval = setInterval(() => setTimeParts(formatDateParts()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         !isDraggingRef.current &&
//         (dragOffsetX.get() !== 0 || dragOffsetY.get() !== 0)
//       ) {
//         animate(dragOffsetX, 0, {
//           type: 'spring',
//           stiffness: 150,
//           damping: 20,
//         });
//         animate(dragOffsetY, 0, {
//           type: 'spring',
//           stiffness: 150,
//           damping: 20,
//         });
//       }
//     };
//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [dragOffsetX, dragOffsetY]);

//   // ... (x, y, magnet, transform, scale, dll tidak berubah) ...
//   const x =
//     externalX ||
//     useSpring(
//       useTransform(activeScroll, motionConfig.xInput, motionConfig.xOutput),
//       { stiffness: 100, damping: 20 }
//     );
//   const y =
//     externalY ||
//     useSpring(
//       useTransform(activeScroll, motionConfig.yInput, motionConfig.yOutput),
//       { stiffness: 100, damping: 20 }
//     );

//   const desktopBubbleMagnet = useMagneticBubble(ref);
//   const desktopTextMagnet = useMagneticBubble(ref, { pullForce: 0.25 });

//   const finalBubbleX = useTransform(
//     [x, desktopBubbleMagnet.x, springTouchBubbleMagneticX, dragOffsetX],
//     (latest) => latest.reduce((a, b) => a + b, 0)
//   );
//   const finalBubbleY = useTransform(
//     [y, desktopBubbleMagnet.y, springTouchBubbleMagneticY, dragOffsetY],
//     (latest) => latest.reduce((a, b) => a + b, 0)
//   );

//   const finalTextX = useTransform(
//     [desktopTextMagnet.x, springTouchTextMagneticX],
//     (latest) => latest.reduce((a, b) => a + b, 0)
//   );
//   const finalTextY = useTransform(
//     [desktopTextMagnet.y, springTouchTextMagneticY],
//     (latest) => latest.reduce((a, b) => a + b, 0)
//   );

//   const baseScale =
//     externalScale ||
//     useSpring(
//       useTransform(
//         activeScroll,
//         motionConfig.scaleInput,
//         motionConfig.scaleOutput
//       ),
//       { stiffness: 100, damping: 20 }
//     );
//   const animatedScale = useMotionValue(1);
//   useEffect(() => {
//     const unsubscribe = baseScale.on('change', (scrollScale) => {
//       if (!hovered) animatedScale.set(scrollScale);
//     });
//     return () => unsubscribe();
//   }, [baseScale, hovered]);

//   // ... (handler hover, klik, tap, pointer, drag tidak berubah) ...
//   const handleHoverStart = () => {
//     setHovered(true);
//     animate(animatedScale, baseScale.get() * 1.12, {
//       type: 'spring',
//       stiffness: 180,
//       damping: 12,
//     });
//   };

//   const handleHoverEnd = () => {
//     setHovered(false);
//     animate(animatedScale, baseScale.get(), {
//       type: 'spring',
//       stiffness: 180,
//       damping: 20,
//     });
//   };

//   const handleClick = () => {
//     if (activeStages?.[stageIndex]?.onClick) {
//       activeStages[stageIndex].onClick();
//     }
//   };

//   const handleTap = () => {
//     if (justDragged.current) {
//       return;
//     }
//     handleClick();
//     const current = baseScale.get();
//     animate(animatedScale, current * 0.88, {
//       type: 'spring',
//       stiffness: 300,
//       damping: 10,
//     });
//     setTimeout(() => {
//       animate(animatedScale, current * 1.05, {
//         type: 'spring',
//         stiffness: 200,
//         damping: 15,
//       });
//       setTimeout(() => {
//         animate(animatedScale, current, {
//           type: 'spring',
//           stiffness: 180,
//           damping: 20,
//         });
//       }, 250);
//     }, 250);
//   };

//   const handlePointerDown = (e) => {
//     if (e.pointerType === 'mouse') return;
//     clearTimeout(gestureState.current.holdTimeout);
//     const timeSinceLastTap = Date.now() - gestureState.current.lastTapUpTime;
//     if (timeSinceLastTap < 300) {
//       clearTimeout(gestureState.current.holdTimeout);
//       setIsDragging(true);
//       gestureState.current.dragStartPos = {
//         x: e.clientX - dragOffsetX.get(),
//         y: e.clientY - dragOffsetY.get(),
//       };
//     } else {
//       gestureState.current.holdTimeout = setTimeout(() => {
//         gestureState.current.isMagneticHold = true;
//       }, 220);
//     }
//   };

//   const handlePointerMove = (e) => {
//     if (e.pointerType === 'mouse') return;
//     if (gestureState.current.isMagneticHold && !isDragging) {
//       const { clientX, clientY } = e;
//       const { left, top, width, height } = ref.current.getBoundingClientRect();
//       const centerX = left + width / 2;
//       const centerY = top + height / 2;
//       const bubbleMoveX = (clientX - centerX) * 0.6;
//       const bubbleMoveY = (clientY - centerY) * 0.6;
//       touchBubbleMagneticX.set(bubbleMoveX);
//       touchBubbleMagneticY.set(bubbleMoveY);
//       const textMoveX = (clientX - centerX) * 0.3;
//       const textMoveY = (clientY - centerY) * 0.3;
//       touchTextMagneticX.set(textMoveX);
//       touchTextMagneticY.set(textMoveY);
//     }
//     if (isDragging) {
//       dragOffsetX.set(e.clientX - gestureState.current.dragStartPos.x);
//       dragOffsetY.set(e.clientY - gestureState.current.dragStartPos.y);
//     }
//   };

//   const handlePointerUp = (e) => {
//     if (e.pointerType === 'mouse') return;
//     gestureState.current.lastTapUpTime = Date.now();
//     clearTimeout(gestureState.current.holdTimeout);

//     if (isDragging) {
//       justDragged.current = true;
//       setTimeout(() => {
//         justDragged.current = false;
//       }, 50);
//     }

//     gestureState.current.isMagneticHold = false;
//     touchBubbleMagneticX.set(0);
//     touchBubbleMagneticY.set(0);
//     touchTextMagneticX.set(0);
//     touchTextMagneticY.set(0);
//     setIsDragging(false);
//   };

//   const handleDesktopDrag = (e, info) => {
//     dragOffsetX.set(dragOffsetX.get() + info.delta.x);
//     dragOffsetY.set(dragOffsetY.get() + info.delta.y);
//   };

//   const handleDesktopDragEnd = () => {
//     setIsDragging(false);
//     justDragged.current = true;
//     setTimeout(() => {
//       justDragged.current = false;
//     }, 50);
//   };

//   // --- 3. LOGIKA BARU UNTUK VARIABEL TAMPILAN (DIMODIFIKASI) ---
//   const currentStage = activeStages?.[stageIndex];
//   const showHoverEffect = currentStage?.isHoverable ?? true;

//   const isHoveredOn = hovered && showHoverEffect && !isDragging;
//   const baseText = currentStage?.text;
//   const hoverText = currentStage?.hoverText;

//   // Kondisi 1: Tampilkan Lottie? (MODIFIKASI)
//   // Tampil jika:
//   // 1. TIDAK di-hover DAN baseText kosong
//   // ATAU
//   // 2. DI-HOVER DAN hoverText kosong
//   const showLottie =
//     (!isHoveredOn && (!baseText || baseText === '')) ||
//     (isHoveredOn && (!hoverText || hoverText === ''));

//   // Kondisi 2: Tampilkan Teks? (MODIFIKASI)
//   // Tampilkan teks jika kita TIDAK menampilkan Lottie.
//   const showText = !showLottie;

//   // Menentukan Teks apa yang akan ditampilkan (hanya jika showText true)
//   // Logika ini tidak perlu diubah, sudah benar.
//   let displayTextContent = '';
//   if (isHoveredOn) {
//     // Logika hover
//     if (hoverText === 'date') {
//       displayTextContent = (
//         <>
//           {timeParts.date} <br /> {timeParts.hours}{' '}
//           <motion.span
//             animate={{ opacity: [1, 0, 1] }}
//             transition={{ duration: 1, repeat: Infinity }}
//             style={{ margin: '0 4px' }}>
//             :{' '}
//           </motion.span>
//           {timeParts.minutes}
//         </>
//       );
//     } else {
//       displayTextContent = hoverText || ''; // Fallback
//     }
//   } else {
//     // Logika base (tidak di-hover)
//     if (baseText === 'date') {
//       displayTextContent = (
//         <>
//           {timeParts.date} <br /> {timeParts.hours}{' '}
//           <motion.span
//             animate={{ opacity: [1, 0, 1] }}
//             transition={{ duration: 1, repeat: Infinity }}
//             style={{ margin: '0 4px' }}>
//             :{' '}
//           </motion.span>
//           {timeParts.minutes}
//         </>
//       );
//     } else {
//       displayTextContent = baseText || ''; // Fallback
//     }
//   }

//   // --- Variabel styling (tidak berubah) ---
//   const baseBackgroundColor = currentStage?.baseBg || 'rgba(0,0,0,0.1)';
//   const hoverBackgroundColor = currentStage?.bg || 'rgba(0, 0, 0, 0.3)';
//   const textColor = currentStage?.color || '#fff';

//   // --- STYLING (Tidak Berubah) ---
//   const bubbleBaseStyle = {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     textAlign: 'center',
//     borderRadius: '50%',
//     width: '150px',
//     height: '150px',
//     position: 'fixed',
//     backdropFilter: 'blur(12px)',
//     WebkitBackdropFilter: 'blur(12px)',
//     border: '0.5px solid rgba(255, 255, 255, 0.3)',
//     zIndex: 10,
//     pointerEvents: 'auto',
//     overflow: 'hidden',
//   };
//   const textStyle = {
//     userSelect: 'none',
//     position: 'relative',
//     zIndex: 2,
//     transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
//   };

//   // --- 4. JSX (Render) (Tidak Berubah) ---
//   // JSX ini sudah menggunakan 'showText' dan 'showLottie'
//   // sehingga tidak perlu diubah.
//   return (
//     <motion.div
//       ref={ref}
//       style={{
//         ...bubbleBaseStyle,
//         ...bubblePosition,
//         x: finalBubbleX,
//         y: finalBubbleY,
//         scale: animatedScale,
//         color: textColor,
//         backgroundColor: baseBackgroundColor,
//         cursor: isDragging ? 'grabbing' : 'grab',
//         touchAction: 'none',
//       }}
//       // ... (Semua handler: onHoverStart, onHoverEnd, drag, onTap, onPointer... tidak berubah) ...
//       onHoverStart={
//         showHoverEffect && !isDragging ? handleHoverStart : undefined
//       }
//       onHoverEnd={showHoverEffect && !isDragging ? handleHoverEnd : undefined}
//       drag={typeof window !== 'undefined' && window.innerWidth > 1024}
//       onDrag={handleDesktopDrag}
//       onDragStart={() => setIsDragging(true)}
//       onDragEnd={handleDesktopDragEnd}
//       onTap={handleTap}
//       onPointerDown={handlePointerDown}
//       onPointerMove={handlePointerMove}
//       onPointerUp={handlePointerUp}
//       onPointerCancel={handlePointerUp}>
//       <motion.div
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           borderRadius: '50%',
//           backgroundColor:
//             hovered && showHoverEffect ? hoverBackgroundColor : 'transparent',
//           zIndex: 1,
//         }}
//         initial='initial'
//         animate={
//           hovered && showHoverEffect && !isDragging ? 'hover' : 'initial'
//         }
//         variants={{ initial: { scale: 0 }, hover: { scale: 1 } }}
//         transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
//       />

//       {/* --- KONTEN BARU DENGAN ANIMASI TUKAR --- */}

//       {showText && (
//         <motion.span
//           // Gunakan konten sebagai key untuk memicu animasi saat teks berubah
//           key={String(displayTextContent)}
//           style={{ ...textStyle, x: finalTextX, y: finalTextY }}
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.9 }}
//           transition={{ duration: 0.3 }}>
//           {displayTextContent}
//         </motion.span>
//       )}

//       {showLottie && (
//         <motion.div
//           key='lottie-bubble-content' // Key statis untuk Lottie
//           style={{
//             ...textStyle,
//             x: finalTextX,
//             y: finalTextY,
//             width: '90%', // Sesuaikan ukuran Lottie
//             height: '90%', // Sesuaikan ukuran Lottie
//           }}
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.9 }}
//           transition={{ duration: 0.3 }}>
//           <DotLottieReact
//             src='/starGlobe.json'
//             loop
//             autoplay
//           />
//         </motion.div>
//       )}
//     </motion.div>
//   );
// };

// export default DateBubble;

// File: src/components/DateBubble/DateBubble.jsx
// Versi ini sudah terintegrasi dengan ChatContext
// File: src/components/DateBubble/DateBubble.jsx
// VERSI 17 (FINAL): Perbaikan Bug Posisi & Animasi
// 1. Logika 'updateSpeechBubblePosition' sekarang menggunakan getBoundingClientRect()
// 2. Animasi SpeechBubble sekarang HANYA scale/opacity

import { useEffect, useState, useRef, useContext } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  animate,
  useScroll,
  AnimatePresence,
} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useResponsiveBubble from './UseResponsiveBubble';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useChat } from '../../context/ChatContext';

// ====================================================================
// --- HOOKS KUSTOM ---
// ====================================================================

// --- Hook: useWindowSize (BARU) ---
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return { width: size[0], height: size[1] };
};

// --- Hook: useClickOutside (BARU) ---
const useClickOutside = (bubbleRef, speechRef, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        bubbleRef.current &&
        !bubbleRef.current.contains(event.target) &&
        (!speechRef.current || !speechRef.current.contains(event.target))
      ) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [bubbleRef, speechRef, callback]);
};

// --- Hook: useMagneticBubble (Kode Asli Anda) ---
const useMagneticBubble = (ref, options = {}) => {
  const {
    pullForce = 0.6,
    magneticThreshold = 120,
    springConfig = { damping: 10, stiffness: 200 },
  } = options;
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const springX = useSpring(magneticX, springConfig);
  const springY = useSpring(magneticY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distance = Math.sqrt(
        Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2)
      );
      if (distance < magneticThreshold) {
        const moveX = (clientX - centerX) * pullForce;
        const moveY = (clientY - centerY) * pullForce;
        magneticX.set(moveX);
        magneticY.set(moveY);
      } else {
        magneticX.set(0);
        magneticY.set(0);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [ref, magneticX, magneticY, pullForce, magneticThreshold]);

  return { x: springX, y: springY };
};

// --- Fungsi Helper untuk Format Waktu (Kode Asli Anda) ---
const formatDateParts = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const date = now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return { date, hours, minutes };
};

// ==========================================================
// --- Komponen Internal: SpeechBubble ---
// ==========================================================
const SpeechBubble = ({ message, style, speechRef }) => {
  return (
    <motion.div
      ref={speechRef}
      layout // PENTING: Animasi mulus saat 'style' (posisi) berubah
      style={{
        ...style,
        position: 'absolute',
        background: 'rgba(255, 255, 255, 0.9)',
        color: '#111',
        padding: '12px 18px',
        borderRadius: '18px',
        maxWidth: '300px',
        minWidth: '150px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        zIndex: -1,
      }}
      // ==========================================================
      // --- PERBAIKAN BUG #1: Animasi "Mantul" Dihapus ---
      // ==========================================================
      initial={{ opacity: 0, scale: 0.8 }} // <-- HANYA opacity & scale
      animate={{ opacity: 1, scale: 1 }} // <-- HANYA opacity & scale
      exit={{ opacity: 0, scale: 0.8 }} // <-- HANYA opacity & scale
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
      <p
        style={{
          margin: 0,
          whiteSpace: 'pre-wrap',
          fontWeight: 500,
          fontSize: '0.9rem',
        }}>
        {message.reply_text}
      </p>
      {/* <span
        style={{
          fontSize: '0.75rem',
          color: '#555',
          opacity: 0.8,
          display: 'block',
          marginTop: '5px',
        }}>
        (via: {message.source})
      </span> */}
    </motion.div>
  );
};

// ==========================================================
// --- Komponen Utama: DateBubble ---
// ==========================================================
const DateBubble = ({
  mode = 'default',
  motionConfig: externalMotionConfig,
  customStages,
  position: externalPosition,
  x: externalX,
  y: externalY,
  scale: externalScale,
  scrollYProgress: externalScrollYProgress,
  navigate: externalNavigate,
}) => {
  // --- Koneksi ke Context & Hooks ---
  const { lastAiMessage, setLastAiMessage } = useChat();
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const speechRef = useRef(null);
  const bubbleRef = useRef(null); // Ganti nama 'ref' utama Anda
  const [speechStyle, setSpeechStyle] = useState({});

  // --- State & Ref (Kode Asli Anda) ---
  const navigate = externalNavigate || useNavigate();
  const [timeParts, setTimeParts] = useState(formatDateParts());
  const [hovered, setHovered] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragOffsetX = useMotionValue(0);
  const dragOffsetY = useMotionValue(0);
  const justDragged = useRef(false);
  const gestureState = useRef({
    lastTapUpTime: 0,
    holdTimeout: null,
    isMagneticHold: false,
    dragStartPos: { x: 0, y: 0 },
  });
  const touchBubbleMagneticX = useMotionValue(0);
  const touchBubbleMagneticY = useMotionValue(0);
  const springTouchBubbleMagneticX = useSpring(touchBubbleMagneticX, {
    damping: 10,
    stiffness: 200,
  });
  const springTouchBubbleMagneticY = useSpring(touchBubbleMagneticY, {
    damping: 10,
    stiffness: 200,
  });
  const touchTextMagneticX = useMotionValue(0);
  const touchTextMagneticY = useMotionValue(0);
  const springTouchTextMagneticX = useSpring(touchTextMagneticX, {
    damping: 12,
    stiffness: 180,
  });
  const springTouchTextMagneticY = useSpring(touchTextMagneticY, {
    damping: 12,
    stiffness: 180,
  });

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // --- Logika Asli Anda (Menggunakan 'bubbleRef' baru) ---
  const { scrollYProgress } = useScroll({
    target: bubbleRef, // <-- PERUBAHAN
    offset: ['start start', 'end end'],
  });
  const activeScroll = externalScrollYProgress || scrollYProgress;
  const { position: defaultPosition, motionConfig: defaultMotionConfig } =
    useResponsiveBubble();
  const motionConfig = externalMotionConfig || defaultMotionConfig;
  const bubblePosition = externalPosition || defaultPosition;

  // --- Logika Stages (Kode Asli Anda) ---
  const defaultStages = [
    {
      range: [0, 0.2],
      text: '',
      hoverText: 'date',
      bg: 'rgba(0, 0, 0, 0.3)',
      color: '#fff',
      onClick: () => navigate('/'),
      isHoverable: true,
    },
    {
      range: [0.2, 0.4],
      text: 'About',
      bg: '#0b60df33',
      baseBg: '#002f45',
      color: '#fff',
      onClick: () => navigate('/about'),
      isHoverable: true,
    },
    {
      range: [0.4, 0.7],
      text: 'Projects',
      bg: 'rgba(32, 42, 68, 0.6)',
      color: '#ffffffff',
      isHoverable: false,
    },
    {
      range: [0.7, 0.8],
      text: '',
      hoverText: 'Archive',
      bg: '#0b60df33',
      baseBg: '#002f45',
      color: '#fff',
      onClick: () => navigate('/portfolio'),
      isHoverable: true,
    },
    {
      range: [0.8, 0.9],
      text: 'Sapere aude_Kant',
      bg: '#002f45',
      color: 'cadetblue',
      isHoverable: false,
    },
    {
      range: [0.9, Infinity],
      text: 'Get in Touch',
      hoverText: 'Tanya Saya!',
      bg: '#0b60df33',
      baseBg: '#002f45',
      color: '#fff',
      onClick: () => console.log('User ingin chat!'),
      isHoverable: true,
    },
  ];
  const activeStages =
    mode === 'custom' && customStages ? customStages : defaultStages;
  useMotionValueEvent(activeScroll, 'change', (latest) => {
    const index = activeStages.findIndex(
      ({ range }) => latest >= range[0] && latest < range[1]
    );
    if (index !== -1) {
      setStageIndex(index);
    }
  });

  // --- useEffects Asli Anda (Tidak Berubah) ---
  useEffect(() => {
    const interval = setInterval(() => setTimeParts(formatDateParts()), 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (
        !isDraggingRef.current &&
        (dragOffsetX.get() !== 0 || dragOffsetY.get() !== 0)
      ) {
        animate(dragOffsetX, 0, {
          type: 'spring',
          stiffness: 150,
          damping: 20,
        });
        animate(dragOffsetY, 0, {
          type: 'spring',
          stiffness: 150,
          damping: 20,
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dragOffsetX, dragOffsetY]);

  // --- Logika Motion (Menggunakan 'bubbleRef' baru) ---
  const x =
    externalX ||
    useSpring(
      useTransform(activeScroll, motionConfig.xInput, motionConfig.xOutput),
      { stiffness: 100, damping: 20 }
    );
  const y =
    externalY ||
    useSpring(
      useTransform(activeScroll, motionConfig.yInput, motionConfig.yOutput),
      { stiffness: 100, damping: 20 }
    );
  const desktopBubbleMagnet = useMagneticBubble(bubbleRef); // <-- PERUBAHAN
  const desktopTextMagnet = useMagneticBubble(bubbleRef, { pullForce: 0.25 }); // <-- PERUBAHAN
  const finalBubbleX = useTransform(
    [x, desktopBubbleMagnet.x, springTouchBubbleMagneticX, dragOffsetX],
    (latest) => latest.reduce((a, b) => a + b, 0)
  );
  const finalBubbleY = useTransform(
    [y, desktopBubbleMagnet.y, springTouchBubbleMagneticY, dragOffsetY],
    (latest) => latest.reduce((a, b) => a + b, 0)
  );

  // ==========================================================
  // --- PERBAIKAN BUG #2: Logika Posisi Dinamis (DIROMBAK TOTAL) ---
  // ==========================================================
  const updateSpeechBubblePosition = () => {
    // 1. Pastikan bubble sudah ada di DOM
    if (!bubbleRef.current) return;

    // 2. Dapatkan posisi *sebenarnya* bubble di layar
    //    Ini adalah koordinat absolut (kiri, atas, lebar, tinggi)
    const { left, top, width, height } =
      bubbleRef.current.getBoundingClientRect();

    // 3. Definisikan konstanta (sesuaikan jika perlu)
    const bubblePadding = 10; // Jarak aman dari bubble
    const speechBubbleWidth = 300; // Perkiraan lebar maks speech bubble
    const speechBubbleHeight = 150; // Perkiraan tinggi maks speech bubble

    // 4. Hitung sisa ruang di 4 sisi (ini sekarang 100% akurat)
    const spaceRight = windowWidth - (left + width + bubblePadding);
    const spaceLeft = left - bubblePadding;
    const spaceTop = top - bubblePadding;
    const spaceBottom = windowHeight - (top + height + bubblePadding);

    let newStyle = {};

    // 5. Logika menentukan sisi terbaik (sesuai permintaan Anda)
    //    Style 'left', 'top', dll. ini adalah *relatif* terhadap induknya (DateBubble)
    if (spaceRight > speechBubbleWidth) {
      // Pilihan 1: Kanan (Default)
      newStyle = {
        left: `${width + bubblePadding}px`,
        top: `${height / 2 - speechBubbleHeight / 2}px`, // Pusatkan secara vertikal
        borderTopLeftRadius: '5px',
      };
    } else if (spaceLeft > speechBubbleWidth) {
      // Pilihan 2: Kiri
      newStyle = {
        left: `-${speechBubbleWidth + bubblePadding}px`,
        top: `${height / 2 - speechBubbleHeight / 2}px`, // Pusatkan secara vertikal
        borderTopRightRadius: '5px',
      };
    } else if (spaceBottom > speechBubbleHeight) {
      // Pilihan 3: Bawah
      newStyle = {
        left: `${width / 2 - speechBubbleWidth / 2}px`, // Pusatkan secara horizontal
        top: `${height + bubblePadding}px`,
        borderTopLeftRadius: '5px',
      };
    } else {
      // Pilihan 4: Atas
      newStyle = {
        left: `${width / 2 - speechBubbleWidth / 2}px`, // Pusatkan secara horizontal
        top: `-${speechBubbleHeight + bubblePadding}px`,
        borderBottomLeftRadius: '5px',
      };
    }

    setSpeechStyle(newStyle);
  };

  // "Dengarkan" pergerakan bubble dan perbarui posisi speech bubble
  // Kita panggil fungsi update TANPA parameter, karena ia akan membaca dari ref
  useMotionValueEvent(finalBubbleX, 'change', updateSpeechBubblePosition);
  useMotionValueEvent(finalBubbleY, 'change', updateSpeechBubblePosition);
  // Hitung ulang juga saat window di-resize dan saat stage berubah
  useEffect(updateSpeechBubblePosition, [
    windowWidth,
    windowHeight,
    stageIndex,
  ]);

  // --- Logika Klik di Luar (Sesuai Permintaan Anda) ---
  useClickOutside(bubbleRef, speechRef, () => {
    if (lastAiMessage) {
      setLastAiMessage(null); // Hilangkan pesan
    }
  });

  // --- Sisa Logika Asli Anda (Utuh) ---
  const finalTextX = useTransform(
    [desktopTextMagnet.x, springTouchTextMagneticX],
    (latest) => latest.reduce((a, b) => a + b, 0)
  );
  const finalTextY = useTransform(
    [desktopTextMagnet.y, springTouchTextMagneticY],
    (latest) => latest.reduce((a, b) => a + b, 0)
  );
  const baseScale =
    externalScale ||
    useSpring(
      useTransform(
        activeScroll,
        motionConfig.scaleInput,
        motionConfig.scaleOutput
      ),
      { stiffness: 100, damping: 20 }
    );
  const animatedScale = useMotionValue(1);
  useEffect(() => {
    const unsubscribe = baseScale.on('change', (scrollScale) => {
      if (!hovered) animatedScale.set(scrollScale);
    });
    return () => unsubscribe();
  }, [baseScale, hovered]);

  // --- Handlers (Utuh) ---
  const handleHoverStart = () => {
    setHovered(true);
    animate(animatedScale, baseScale.get() * 1.12, {
      type: 'spring',
      stiffness: 180,
      damping: 12,
    });
  };

  const handleHoverEnd = () => {
    setHovered(false);
    animate(animatedScale, baseScale.get(), {
      type: 'spring',
      stiffness: 180,
      damping: 20,
    });
  };

  const handleClick = () => {
    if (activeStages?.[stageIndex]?.onClick) {
      activeStages[stageIndex].onClick();
    }
  };

  const handleTap = () => {
    if (justDragged.current) {
      return;
    }
    handleClick();
    const current = baseScale.get();
    animate(animatedScale, current * 0.88, {
      type: 'spring',
      stiffness: 300,
      damping: 10,
    });
    setTimeout(() => {
      animate(animatedScale, current * 1.05, {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      });
      setTimeout(() => {
        animate(animatedScale, current, {
          type: 'spring',
          stiffness: 180,
          damping: 20,
        });
      }, 250);
    }, 250);
  };

  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse') return;
    clearTimeout(gestureState.current.holdTimeout);
    const timeSinceLastTap = Date.now() - gestureState.current.lastTapUpTime;
    if (timeSinceLastTap < 300) {
      clearTimeout(gestureState.current.holdTimeout);
      setIsDragging(true);
      gestureState.current.dragStartPos = {
        x: e.clientX - dragOffsetX.get(),
        y: e.clientY - dragOffsetY.get(),
      };
    } else {
      gestureState.current.holdTimeout = setTimeout(() => {
        gestureState.current.isMagneticHold = true;
      }, 220);
    }
  };

  const handlePointerMove = (e) => {
    if (e.pointerType === 'mouse') return;
    if (gestureState.current.isMagneticHold && !isDragging) {
      if (!bubbleRef.current) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } =
        bubbleRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const bubbleMoveX = (clientX - centerX) * 0.6;
      const bubbleMoveY = (clientY - centerY) * 0.6;
      touchBubbleMagneticX.set(bubbleMoveX);
      touchBubbleMagneticY.set(bubbleMoveY);
      const textMoveX = (clientX - centerX) * 0.3;
      const textMoveY = (clientY - centerY) * 0.3;
      touchTextMagneticX.set(textMoveX);
      touchTextMagneticY.set(textMoveY);
    }
    if (isDragging) {
      dragOffsetX.set(e.clientX - gestureState.current.dragStartPos.x);
      dragOffsetY.set(e.clientY - gestureState.current.dragStartPos.y);
    }
  };

  const handlePointerUp = (e) => {
    if (e.pointerType === 'mouse') return;
    gestureState.current.lastTapUpTime = Date.now();
    clearTimeout(gestureState.current.holdTimeout);

    if (isDragging) {
      justDragged.current = true;
      setTimeout(() => {
        justDragged.current = false;
      }, 50);
    }

    gestureState.current.isMagneticHold = false;
    touchBubbleMagneticX.set(0);
    touchBubbleMagneticY.set(0);
    touchTextMagneticX.set(0);
    touchTextMagneticY.set(0);
    setIsDragging(false);
  };

  const handleDesktopDrag = (e, info) => {
    dragOffsetX.set(dragOffsetX.get() + info.delta.x);
    dragOffsetY.set(dragOffsetY.get() + info.delta.y);
  };

  const handleDesktopDragEnd = () => {
    setIsDragging(false);
    justDragged.current = true;
    setTimeout(() => {
      justDragged.current = false;
    }, 50);
  };

  // --- Logika Tampilan Teks (Utuh) ---
  const currentStage = activeStages?.[stageIndex];
  const showHoverEffect = currentStage?.isHoverable ?? true;
  const isHoveredOn = hovered && showHoverEffect && !isDragging;
  const baseText = currentStage?.text;
  const hoverText = currentStage?.hoverText;
  const showLottie =
    (!isHoveredOn && (!baseText || baseText === '')) ||
    (isHoveredOn && (!hoverText || hoverText === ''));
  const showText = !showLottie;

  let displayTextContent = '';
  if (isHoveredOn) {
    if (hoverText === 'date') {
      displayTextContent = (
        <>
          {timeParts.date} <br /> {timeParts.hours}{' '}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ margin: '0 4px' }}>
            :{' '}
          </motion.span>
          {timeParts.minutes}
        </>
      );
    } else {
      displayTextContent = hoverText || '';
    }
  } else {
    if (baseText === 'date') {
      displayTextContent = (
        <>
          {timeParts.date} <br /> {timeParts.hours}{' '}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ margin: '0 4px' }}>
            :{' '}
          </motion.span>
          {timeParts.minutes}
        </>
      );
    } else {
      displayTextContent = baseText || '';
    }
  }

  const baseBackgroundColor = currentStage?.baseBg || 'rgba(0,0,0,0.1)';
  const hoverBackgroundColor = currentStage?.bg || 'rgba(0, 0, 0, 0.3)';
  const textColor = currentStage?.color || '#fff';

  // --- STYLING (PERBAIKAN PENTING) ---
  const bubbleBaseStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: '50%',
    width: '150px',
    height: '150px',
    position: 'fixed',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '0.5px solid rgba(255, 255, 255, 0.3)',
    zIndex: 10,
    pointerEvents: 'auto',
    overflow: 'visible', // <-- HARUS 'visible' agar speech bubble terlihat
  };
  const textStyle = {
    userSelect: 'none',
    position: 'relative',
    zIndex: 2,
    transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  // --- 4. JSX (Render) ---
  return (
    <motion.div
      ref={bubbleRef} // <-- Ganti 'ref' menjadi 'bubbleRef'
      style={{
        ...bubbleBaseStyle,
        ...bubblePosition,
        x: finalBubbleX,
        y: finalBubbleY,
        scale: animatedScale,
        color: textColor,
        backgroundColor: baseBackgroundColor,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
      // --- Handler Asli Anda (Utuh) ---
      onHoverStart={
        showHoverEffect && !isDragging ? handleHoverStart : undefined
      }
      onHoverEnd={showHoverEffect && !isDragging ? handleHoverEnd : undefined}
      drag={typeof window !== 'undefined' && window.innerWidth > 1024}
      onDrag={handleDesktopDrag}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDesktopDragEnd}
      onTap={handleTap}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}>
      {/* --- RENDER SPEECH BUBBLE (Sekarang Cerdas!) --- */}
      <AnimatePresence>
        {lastAiMessage && (
          <SpeechBubble
            message={lastAiMessage}
            style={speechStyle} // <-- Gunakan style dinamis kita
            speechRef={speechRef} // <-- Berikan ref untuk 'click-outside'
          />
        )}
      </AnimatePresence>

      {/* Sisa JSX Asli Anda (Tidak Berubah) */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor:
            hovered && showHoverEffect ? hoverBackgroundColor : 'transparent',
          zIndex: 1,
        }}
        initial='initial'
        animate={
          hovered && showHoverEffect && !isDragging ? 'hover' : 'initial'
        }
        variants={{ initial: { scale: 0 }, hover: { scale: 1 } }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      {showText && (
        <motion.span
          key={String(displayTextContent)}
          style={{ ...textStyle, x: finalTextX, y: finalTextY }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}>
          {displayTextContent}
        </motion.span>
      )}
      {showLottie && (
        <motion.div
          key='lottie-bubble-content'
          style={{
            ...textStyle,
            x: finalTextX,
            y: finalTextY,
            width: '90%',
            height: '90%',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}>
          <DotLottieReact
            src='/starGlobe.json'
            loop
            autoplay
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default DateBubble;
