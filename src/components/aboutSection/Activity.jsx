// import React, { useState, useEffect, useRef } from 'react';
// import {
//   motion,
//   AnimatePresence,
//   useTransform,
//   useScroll,
//   useMotionValue,
//   useAnimationFrame,
//   useSpring,
// } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import './Activity.scss';
// import Magnetic from '../DateBubble/Magnetic';
// import Wave from '../MorphingWave/Wave';
// import { ButtonReveal } from '../buttonReveal/ButtonReveal';
// import { MasterData } from '../../data/MasterData';
// import { AnimateInteractiveText } from '../AnimatedText/AnimateInteractiveText ';

// // --- CONFIG & DATA ---
// const listWaveConfig = {
//   initialY: { desktop: 0, tablet: -300, mobile: -400 },
//   finalY: { desktop: -395, tablet: -750, mobile: -550 },
//   topWave: {
//     wavePreset: { desktop: 'energetic', tablet: 'default', mobile: 'calm' },
//     controlPoints: {
//       desktop: [50, 50, 50, 50, 50, 50],
//       tablet: [100, 150, 50, 150, 100],
//       mobile: [0, 0, 0],
//     },
//   },
//   bottomWave: {
//     wavePreset: { desktop: 'calm', tablet: 'calm', mobile: 'calm' },
//     controlPoints: {
//       desktop: [650, 700, 550],
//       tablet: [650, 650, 550],
//       mobile: [550, 650, 550],
//     },
//   },
//   springConfig: { stiffness: 10000, damping: 500 },
// };

// // --- UTILITAS ANIMASI ---
// const wrap = (min, max, v) => {
//   const rangeSize = max - min;
//   return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
// };

// const activityItems = MasterData.filter((project) => project.isActivity).slice(
//   0,
//   5
// );

// const variants = {
//   open: { transition: { staggerChildren: 0.1 } },
//   closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
// };
// const itemVariants = {
//   open: { y: 0, opacity: 1 },
//   closed: { y: 300, opacity: 0 },
// };

// // --- HOOK ---
// const useScrollDirection = () => {
//   const [scrollDirection, setScrollDirection] = useState('down');
//   const lastScrollY = useRef(0);
//   useEffect(() => {
//     const updateScrollDirection = () => {
//       const scrollY = window.pageYOffset;
//       setScrollDirection(scrollY > lastScrollY.current ? 'down' : 'up');
//       lastScrollY.current = scrollY > 0 ? scrollY : 0;
//     };
//     window.addEventListener('scroll', updateScrollDirection, { passive: true });
//     return () => window.removeEventListener('scroll', updateScrollDirection);
//   }, []);
//   return scrollDirection;
// };

// // --- KOMPONEN MARQUEE ---
// const MarqueeText = ({ text, direction }) => {
//   const BASE_VELOCITY = 80;
//   const marqueeX = useMotionValue(0);
//   const velocity = useSpring(
//     direction === 'down' ? -BASE_VELOCITY : BASE_VELOCITY,
//     {
//       stiffness: 80,
//       damping: 40,
//       mass: 2,
//     }
//   );
//   useEffect(() => {
//     velocity.set(direction === 'down' ? -BASE_VELOCITY : BASE_VELOCITY);
//   }, [velocity, direction]);
//   const x = useTransform(marqueeX, (v) => `${wrap(-2048, 0, v)}px`);
//   useAnimationFrame((t, delta) => {
//     const currentVelocity = velocity.get();
//     const moveBy = currentVelocity * (delta / 1000);
//     marqueeX.set(marqueeX.get() + moveBy);
//   });
//   const textContent = `${text} \u00A0 • \u00A0 `;
//   return (
//     <div className='marquee-container'>
//       <motion.div
//         className='marquee-track'
//         style={{ x }}>
//         <span style={{ fontSize: 'clamp(2.5rem, 5vw, 2.8rem)' }}>
//           {textContent.repeat(10)}
//         </span>
//         <span style={{ fontSize: 'clamp(2.5rem, 5vw, 2.8rem)' }}>
//           {textContent.repeat(10)}
//         </span>
//       </motion.div>
//     </div>
//   );
// };

// // --- KOMPONEN ANAK ---
// const ListItemContent = ({
//   project,
//   index,
//   // onMouseEnter,
//   // onMouseLeave,
//   // onClick,
//   isHovered,
//   scrollDirection,
//   // Tambahan props untuk touch events
//   // onTouchStart,
//   // onTouchMove,
//   // onTouchEnd,
//   // style,
// }) => {
//   return (
//     // Gunakan React Fragment (<>) sebagai pembungkus
//     <>
//       <motion.span
//         className='list-item-number'
//         animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0.8 : 1 }}
//         transition={{ duration: 0.4, ease: 'easeOut' }}>
//         {String(index + 1).padStart(2, '0')}
//       </motion.span>
//       <div className='list-item-content-container'>
//         <motion.div
//           className='list-item-content'
//           animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0.8 : 1 }}
//           transition={{ duration: 0.4, ease: 'easeOut' }}>
//           <h3 className='list-item-title'>{project.title}</h3>
//           <p className='list-item-category'>{project.category.join(' & ')}</p>
//         </motion.div>
//       </div>
//       <motion.span
//         className='list-item-year'
//         animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0.8 : 1 }}
//         transition={{ duration: 0.4, ease: 'easeOut' }}>
//         {project.year}
//       </motion.span>
//       <AnimatePresence>
//         {isHovered && (
//           <motion.div
//             className='marquee-full-wrapper'
//             initial={{ opacity: 0, scale: 1.1 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 1.1 }}
//             transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
//             <MarqueeText
//               text={project.title}
//               direction={scrollDirection}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// //TeaserImage mendengarkan touchmove
// const TeaserImage = ({ hoveredProject }) => {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     // Fungsi gabungan untuk update posisi dari mouse atau sentuhan
//     const updatePosition = (e) => {
//       let x, y;
//       if (e.touches && e.touches.length > 0) {
//         // Untuk event sentuhan
//         x = e.touches[0].clientX;
//         y = e.touches[0].clientY;
//       } else {
//         // Untuk event mouse
//         x = e.clientX;
//         y = e.clientY;
//       }
//       setMousePosition({ x, y });
//     };

//     // Daftarkan kedua event listener
//     window.addEventListener('mousemove', updatePosition);
//     window.addEventListener('touchmove', updatePosition);

//     // Hapus kedua listener saat komponen dibongkar
//     return () => {
//       window.removeEventListener('mousemove', updatePosition);
//       window.removeEventListener('touchmove', updatePosition);
//     };
//   }, []);

//   return (
//     <AnimatePresence>
//       {hoveredProject && (
//         <motion.div
//           className='teaser-image'
//           style={{
//             left: mousePosition.x,
//             top: mousePosition.y,
//             transform: 'translate(-50%, -50%)',
//           }}
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.8 }}>
//           <AnimatePresence>
//             <motion.img
//               key={hoveredProject.imageUrl}
//               src={hoveredProject.imageUrl}
//               alt={`${hoveredProject.title} teaser`}
//               variants={{
//                 enter: { y: '100%' },
//                 center: { y: '0%' },
//                 exit: { y: '-100%' },
//               }}
//               initial='enter'
//               animate='center'
//               exit='exit'
//               transition={{ duration: 0.4, ease: [0.8, 0.05, 0.2, 1] }}
//             />
//             <Magnetic>
//               <motion.div
//                 className='teaser-view-button'
//                 initial={{ scale: 0, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0, opacity: 0 }}
//                 transition={{ delay: 0.1, duration: 0.3, ease: 'backOut' }}>
//                 <Magnetic>
//                   <span>View</span>
//                 </Magnetic>
//               </motion.div>
//             </Magnetic>
//           </AnimatePresence>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// const ActivityBlock = ({
//   config,
//   scrollProgress,
//   children,
//   ...eventHandlers
// }) => {
//   const { startX, endX, color, height } = config;

//   // Animasi scroll horizontal
//   const xScroll = useTransform(
//     scrollProgress,
//     [0, 1],
//     [`${startX}%`, `${endX}%`]
//   );

//   return (
//     // Wrapper: menangani animasi 'masuk' (initialX) & tinggi (height)
//     <motion.div
//       className='block-wrapper' // Kita akan pakai style .block-wrapper dari Hero
//       style={{ height: height }}
//       transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
//       {...eventHandlers} // Terapkan onMouseEnter, onClick, dll. di sini
//     >
//       {/* Content: menangani animasi 'scroll' (xScroll) & warna */}
//       <motion.div
//         className='block-content' // Kita akan pakai style .block-content dari Hero
//         style={{
//           x: xScroll,
//           backgroundColor: color,
//         }}>
//         {children} {/* Konten (ListItem atau blok kosong) dirender di sini */}
//       </motion.div>
//     </motion.div>
//   );
// };

// // --- KOMPONEN UTAMA ---
// const Activity = () => {
//   const navigate = useNavigate();

//   const handleNavigate = () => {
//     navigate('/portfolio');
//   };
//   const [hoveredItem, setHoveredItem] = useState(null);
//   const headerRef = useRef(null);
//   const scrollDirection = useScrollDirection();
//   const { scrollYProgress } = useScroll({
//     target: headerRef,
//     offset: ['start start', 'end start'],
//   });

//   const smoothScrollHeader = useSpring(scrollYProgress, {
//     stiffness: 200,
//     damping: 50,
//   });
//   const yText = useTransform(smoothScrollHeader, [0, 1], ['0%', '10%']);
//   const waveBotRef = useRef(null);

//   // --- LOGIKA BARU UNTUK LAYAR SENTUH ---
//   const holdTimerRef = useRef(null);

//   const handleTouchStart = (e, project) => {
//     // Mulai timer untuk mendeteksi "hold"
//     holdTimerRef.current = setTimeout(() => {
//       setHoveredItem(project);
//     }, 200); // 200ms durasi hold
//   };

//   const handleTouchMove = () => {
//     // Jika pengguna menggeser jari (scroll), batalkan timer hold
//     clearTimeout(holdTimerRef.current);
//   };

//   const handleTouchEnd = () => {
//     // Selalu bersihkan timer dan hilangkan efek saat jari diangkat
//     clearTimeout(holdTimerRef.current);
//     setHoveredItem(null);
//   };
//   // --- Akhir Logika Baru ---

//   // Handler untuk mouse (tetap berfungsi)
//   const handleMouseEnterItem = (item) => setHoveredItem(item);
//   const handleMouseLeaveItem = () => setHoveredItem(null);
//   const handleListItemClick = (project) => {
//     // Mengarahkan ke halaman detail proyek sesuai ID
//     navigate(`/project/${project.id}`);
//   };

//   const listWrapperRef = useRef(null); // Ref baru untuk wrapper list
//   const { scrollYProgress: listScrollProgress } = useScroll({
//     target: listWrapperRef,
//     // Animasikan saat wrapper masuk dan keluar layar
//     offset: ['start end', 'end start'],
//   });

//   const smoothScrollList = useSpring(listScrollProgress, {
//     stiffness: 200,
//     damping: 50,
//   });

//   // Periksa apakah activityItems ada 5 item
//   const blockLayout = [];
//   if (activityItems.length >= 5) {
//     // (Contoh nilai - ganti sesuai selera Anda)
//     blockLayout.push(
//       {
//         type: 'item',
//         project: activityItems[0],
//         index: 0,
//         height: '12%',
//         startX: 15,
//         endX: -20,
//         color: '#fff7ed',
//       }, //1
//       {
//         type: 'empty',
//         height: '8%',
//         startX: -90,
//         endX: 0,
//         color: '#fff7ed',
//       }, //2
//       {
//         type: 'empty',
//         height: '8%',
//         startX: 80,
//         endX: 0,
//         color: '#fff7ed',
//       }, //3
//       {
//         type: 'item',
//         project: activityItems[1],
//         index: 1,
//         height: '12%',
//         startX: 20,
//         endX: -20,
//         color: '#fff7ed',
//       }, //4
//       {
//         type: 'empty',
//         height: '8%',
//         startX: 100,
//         endX: 0,
//         color: '#fff7ed',
//       }, //5
//       {
//         type: 'item',
//         project: activityItems[2],
//         index: 2,
//         height: '12%',
//         startX: -20,
//         endX: 15,
//         color: '#fff7ed',
//       }, //6
//       {
//         type: 'empty',
//         height: '8%',
//         startX: -90,
//         endX: 30,
//         color: '#fff7ed',
//       }, //7
//       {
//         type: 'item',
//         project: activityItems[3],
//         index: 3,
//         height: '12%',
//         startX: 0,
//         endX: -20,
//         color: '#fff7ed',
//       }, //8
//       {
//         type: 'empty',
//         height: '8%',
//         startX: 90,
//         endX: 0,
//         color: '#fff7ed',
//       }, //9
//       {
//         type: 'item',
//         project: activityItems[4],
//         index: 4,
//         height: '12%',
//         startX: -20,
//         endX: 5,
//         color: '#fff7ed',
//       } //10
//     );
//   } else {
//     // Fallback jika item tidak cukup: tampilkan sebagai list biasa
//     activityItems.forEach((project, index) => {
//       blockLayout.push({ type: 'item', project, index, height: 'auto' });
//     });
//   }

//   return (
//     <motion.div
//       variants={variants}
//       initial='closed'
//       animate='open'
//       className='activity-container'>
//       <TeaserImage hoveredProject={hoveredItem} />
//       <motion.header
//         ref={headerRef}
//         className='activity-header'
//         variants={itemVariants}>
//         <motion.div
//           className='header-content'
//           style={{ y: yText }}>
//           <div className='header-main-text'>
//             <h1>
//               Still <span>learning,</span> always <span>creating.</span>
//             </h1>
//             <AnimateInteractiveText
//               as='p'
//               initialColor='#888'
//               hoverColor='#888'
//               className='header-subtitle'>
//               I believe growth never ends-every creation is another way to
//               learn.
//             </AnimateInteractiveText>
//           </div>
//           <div className='header-side-text'>
//             <AnimateInteractiveText
//               as='p'
//               initialColor='#888'
//               hoverColor='#888'>
//               This page highlights my journey and the continuous effort to
//               learn, build, and share knowledge within the --community
//             </AnimateInteractiveText>
//           </div>
//         </motion.div>
//       </motion.header>
//       <motion.main
//         className='content-area'
//         variants={itemVariants}>
//         <div className='main-content-wrapper'>
//           <motion.div
//             key='list'
//             className='list-view-wrapper-activity'
//             ref={listWrapperRef}>
//             <div
//               className='list-view-activity'
//               style={{
//                 zIndex: '9999',
//                 display: 'flex',
//                 flexDirection: 'column',
//               }}>
//               {blockLayout.map((config, i) => (
//                 <ActivityBlock
//                   className='list-item-activity '
//                   key={config.project ? config.project.id : `empty-${i}`}
//                   config={config}
//                   scrollProgress={smoothScrollList}
//                   {...(config.type === 'item' && {
//                     onMouseEnter: () => handleMouseEnterItem(config.project),
//                     onMouseLeave: handleMouseLeaveItem,
//                     onClick: () => handleListItemClick(config.project),
//                     onTouchStart: (e) => handleTouchStart(e, config.project),
//                     onTouchMove: handleTouchMove,
//                     onTouchEnd: handleTouchEnd,
//                   })}>
//                   {/* Masukkan Konten sebagai 'children' */}
//                   {config.type === 'item' && (
//                     <ListItemContent
//                       project={config.project}
//                       index={config.index}
//                       isHovered={hoveredItem?.id === config.project.id}
//                       scrollDirection={scrollDirection}
//                     />
//                   )}
//                   {config.type === 'empty' && (
//                     // Tambahkan kelas ini untuk styling
//                     <div className='list-item-empty'></div>
//                   )}
//                 </ActivityBlock>
//               ))}
//             </div>
//             <div className='WaveContainer'>
//               <div
//                 className='WaveHelper'
//                 ref={waveBotRef}>
//                 <Wave
//                   style={{ zIndex: '-1' }}
//                   config={listWaveConfig}
//                   colors={['#fff7ed', '#fff7ed']}
//                   targetRef={waveBotRef}
//                 />
//               </div>
//             </div>
//           </motion.div>
//         </div>
//         <div className='more-activity-container'>
//           <Magnetic>
//             <ButtonReveal
//               as='button' // Menjadikannya elemen <button> asli (baik untuk aksesibilitas)
//               onClick={handleNavigate}
//               className='more-activity-btn'
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}>
//               <Magnetic>
//                 <span>Explore Full Portfolio</span>
//               </Magnetic>
//             </ButtonReveal>
//           </Magnetic>
//         </div>
//       </motion.main>
//     </motion.div>
//   );
// };

// export default Activity;

import React, { useState, useEffect, useRef, useMemo } from 'react'; // Tambah useMemo
import {
  motion,
  AnimatePresence,
  useTransform,
  useScroll,
  useMotionValue,
  useAnimationFrame,
  useSpring,
} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Activity.scss';
import Magnetic from '../DateBubble/Magnetic';
import Wave from '../MorphingWave/Wave';
import { ButtonReveal } from '../buttonReveal/ButtonReveal';
import { MasterData } from '../../data/MasterData';
import { AnimateInteractiveText } from '../AnimatedText/AnimateInteractiveText ';

// --- CONFIG & DATA ---
const listWaveConfig = {
  initialY: { desktop: -200, tablet: -300, mobile: -400 },
  finalY: { desktop: -395, tablet: -750, mobile: -550 },
  topWave: {
    wavePreset: { desktop: 'energetic', tablet: 'default', mobile: 'calm' },
    controlPoints: {
      desktop: [50, 50, 50, 50, 50, 50],
      tablet: [100, 150, 50, 150, 100],
      mobile: [0, 0, 0],
    },
  },
  bottomWave: {
    wavePreset: { desktop: 'calm', tablet: 'calm', mobile: 'calm' },
    controlPoints: {
      desktop: [650, 700, 550],
      tablet: [650, 650, 550],
      mobile: [550, 650, 550],
    },
  },
  springConfig: { stiffness: 10000, damping: 500 },
};

const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// Pindahkan ini ke luar komponen agar tidak dihitung ulang
const activityItems = MasterData.filter((project) => project.isActivity).slice(
  0,
  5
);

const variants = {
  open: { transition: { staggerChildren: 0.1 } },
  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};
const itemVariants = {
  open: { y: 0, opacity: 1 },
  closed: { y: 300, opacity: 0 },
};

// --- HOOK ---
const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('down');
  const lastScrollY = useRef(0);
  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      setScrollDirection(scrollY > lastScrollY.current ? 'down' : 'up');
      lastScrollY.current = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener('scroll', updateScrollDirection, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, []);
  return scrollDirection;
};

// --- KOMPONEN MARQUEE ---
// (Tidak berubah, kode Marquee Anda sudah bagus)
const MarqueeText = ({ text, direction }) => {
  const BASE_VELOCITY = 80;
  const marqueeX = useMotionValue(0);
  const velocity = useSpring(
    direction === 'down' ? -BASE_VELOCITY : BASE_VELOCITY,
    {
      stiffness: 80,
      damping: 40,
      mass: 2,
    }
  );
  useEffect(() => {
    velocity.set(direction === 'down' ? -BASE_VELOCITY : BASE_VELOCITY);
  }, [velocity, direction]);
  const x = useTransform(marqueeX, (v) => `${wrap(-2048, 0, v)}px`);
  useAnimationFrame((t, delta) => {
    const currentVelocity = velocity.get();
    const moveBy = currentVelocity * (delta / 1000);
    marqueeX.set(marqueeX.get() + moveBy);
  });
  const textContent = `${text} \u00A0 • \u00A0 `;
  return (
    <div className='marquee-container'>
      <motion.div
        className='marquee-track'
        style={{ x }}>
        <span style={{ fontSize: 'clamp(2.5rem, 5vw, 2.8rem)' }}>
          {textContent.repeat(10)}
        </span>
        <span style={{ fontSize: 'clamp(2.5rem, 5vw, 2.8rem)' }}>
          {textContent.repeat(10)}
        </span>
      </motion.div>
    </div>
  );
};

// --- KOMPONEN ANAK (ListItemContent) ---
// (Tidak berubah)
const ListItemContent = ({ project, index, isHovered, scrollDirection }) => {
  return (
    <>
      <motion.span
        className='list-item-number'
        animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0.8 : 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}>
        {String(index + 1).padStart(2, '0')}
      </motion.span>
      <div className='list-item-content-container'>
        <motion.div
          className='list-item-content'
          animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0.8 : 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}>
          <h3 className='list-item-title'>{project.title}</h3>
          <p className='list-item-category'>{project.category.join(' & ')}</p>
        </motion.div>
      </div>
      <motion.span
        className='list-item-year'
        animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0.8 : 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}>
        {project.year}
      </motion.span>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className='marquee-full-wrapper'
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
            <MarqueeText
              text={project.title}
              direction={scrollDirection}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- KOMPONEN TeaserImage ---
// (Tidak berubah)
const TeaserImage = ({ hoveredProject }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updatePosition = (e) => {
      let x, y;
      if (e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('touchmove', updatePosition);
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('touchmove', updatePosition);
    };
  }, []);
  return (
    <AnimatePresence>
      {hoveredProject && (
        <motion.div
          className='teaser-image'
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}>
          <AnimatePresence>
            <motion.img
              key={hoveredProject.imageUrl}
              src={hoveredProject.imageUrl}
              alt={`${hoveredProject.title} teaser`}
              variants={{
                enter: { y: '100%' },
                center: { y: '0%' },
                exit: { y: '-100%' },
              }}
              initial='enter'
              animate='center'
              exit='exit'
              transition={{ duration: 0.4, ease: [0.8, 0.05, 0.2, 1] }}
            />
            <Magnetic>
              <motion.div
                className='teaser-view-button'
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.1, duration: 0.3, ease: 'backOut' }}>
                <Magnetic>
                  <span>View</span>
                </Magnetic>
              </motion.div>
            </Magnetic>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==========================================================
// OPTIMASI: ActivityBlock
// ==========================================================
const ActivityBlock = ({
  config,
  scrollProgress,
  children,
  ...eventHandlers
}) => {
  const { startX, endX, color, height } = config;

  // OPTIMASI: Langsung transform dari progress, tanpa spring tambahan per item
  const xScroll = useTransform(
    scrollProgress,
    [0, 1],
    [`${startX}%`, `${endX}%`]
  );

  return (
    <motion.div
      className='block-wrapper'
      style={{ height: height }}
      // OPTIMASI: Menghapus transition yang tidak perlu untuk layout statis
      {...eventHandlers}>
      <motion.div
        className='block-content'
        style={{
          x: xScroll,
          backgroundColor: color,
        }}>
        {children}
      </motion.div>
    </motion.div>
  );
};

// --- KOMPONEN UTAMA ---
const Activity = () => {
  const navigate = useNavigate();
  const handleNavigate = () => navigate('/portfolio');

  const [hoveredItem, setHoveredItem] = useState(null);
  const headerRef = useRef(null);
  const listWrapperRef = useRef(null);
  const waveBotRef = useRef(null);
  const scrollDirection = useScrollDirection();

  // --- Scroll Header ---
  const { scrollYProgress: headerProgress } = useScroll({
    target: headerRef,
    offset: ['start start', 'end start'],
  });
  // Mengurangi stiffness/damping agar lebih responsif, tidak "berat"
  const smoothScrollHeader = useSpring(headerProgress, {
    stiffness: 150,
    damping: 30,
  });
  const yText = useTransform(smoothScrollHeader, [0, 1], ['0%', '10%']);

  // --- Scroll List (PARALLAX) ---
  const { scrollYProgress: listProgress } = useScroll({
    target: listWrapperRef,
    offset: ['start end', 'end start'],
  });
  // OPTIMASI: Spring tunggal untuk seluruh list, bukan per item
  const smoothScrollList = useSpring(listProgress, {
    stiffness: 120,
    damping: 25,
  });

  // --- Touch Handlers ---
  const holdTimerRef = useRef(null);
  const handleTouchStart = (e, project) => {
    holdTimerRef.current = setTimeout(() => setHoveredItem(project), 200);
  };
  const handleTouchMove = () => clearTimeout(holdTimerRef.current);
  const handleTouchEnd = () => {
    clearTimeout(holdTimerRef.current);
    setHoveredItem(null);
  };

  const handleMouseEnterItem = (item) => setHoveredItem(item);
  const handleMouseLeaveItem = () => setHoveredItem(null);
  const handleListItemClick = (project) => navigate(`/project/${project.id}`);

  // OPTIMASI: useMemo untuk blockLayout agar tidak dihitung ulang setiap render
  const blockLayout = useMemo(() => {
    const layout = [];
    if (activityItems.length >= 5) {
      layout.push(
        {
          type: 'item',
          project: activityItems[0],
          index: 0,
          height: '12%',
          startX: 15,
          endX: -20,
          color: '#fff7ed',
        }, //1
        { type: 'empty', height: '8%', startX: -90, endX: 0, color: '#fff7ed' }, //2
        { type: 'empty', height: '8%', startX: 80, endX: 0, color: '#fff7ed' }, //3
        {
          type: 'item',
          project: activityItems[1],
          index: 1,
          height: '12%',
          startX: 20,
          endX: -20,
          color: '#fff7ed',
        }, //4
        { type: 'empty', height: '8%', startX: 100, endX: 0, color: '#fff7ed' }, //5
        {
          type: 'item',
          project: activityItems[2],
          index: 2,
          height: '12%',
          startX: -20,
          endX: 15,
          color: '#fff7ed',
        }, //6
        {
          type: 'empty',
          height: '8%',
          startX: -90,
          endX: 30,
          color: '#fff7ed',
        }, //7
        {
          type: 'item',
          project: activityItems[3],
          index: 3,
          height: '12%',
          startX: 0,
          endX: -20,
          color: '#fff7ed',
        }, //8
        { type: 'empty', height: '8%', startX: 90, endX: 0, color: '#fff7ed' }, //9
        {
          type: 'item',
          project: activityItems[4],
          index: 4,
          height: '12%',
          startX: -20,
          endX: 5,
          color: '#fff7ed',
        } //10
      );
    } else {
      activityItems.forEach((project, index) => {
        layout.push({
          type: 'item',
          project,
          index,
          height: 'auto',
          startX: 0,
          endX: 0,
          color: '#fff7ed',
        });
      });
    }
    return layout;
  }, []); // Dependensi kosong karena activityItems statis di luar

  return (
    <motion.div
      variants={variants}
      initial='closed'
      animate='open'
      className='activity-container'>
      <TeaserImage hoveredProject={hoveredItem} />

      <motion.header
        ref={headerRef}
        className='activity-header'
        variants={itemVariants}>
        <motion.div
          className='header-content'
          style={{ y: yText }}>
          <div className='header-main-text'>
            <h1>
              Still <span>learning,</span> always <span>creating.</span>
            </h1>
            <AnimateInteractiveText
              as='p'
              initialColor='#888'
              hoverColor='#888'
              className='header-subtitle'>
              I believe growth never ends-every creation is another way to
              learn.
            </AnimateInteractiveText>
          </div>
          <div className='header-side-text'>
            <AnimateInteractiveText
              as='p'
              initialColor='#888'
              hoverColor='#888'>
              This page highlights my journey and the continuous effort to
              learn, build, and share knowledge within the --community
            </AnimateInteractiveText>
          </div>
        </motion.div>
      </motion.header>

      <motion.main
        className='content-area'
        variants={itemVariants}>
        <div className='main-content-wrapper'>
          <motion.div
            key='list'
            className='list-view-wrapper-activity'
            ref={listWrapperRef}>
            <div
              className='list-view-activity'
              style={{
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
              }}>
              {blockLayout.map((config, i) => (
                <ActivityBlock
                  className='list-item-activity'
                  key={config.project ? config.project.id : `empty-${i}`}
                  config={config}
                  scrollProgress={smoothScrollList}
                  {...(config.type === 'item' && {
                    onMouseEnter: () => handleMouseEnterItem(config.project),
                    onMouseLeave: handleMouseLeaveItem,
                    onClick: () => handleListItemClick(config.project),
                    onTouchStart: (e) => handleTouchStart(e, config.project),
                    onTouchMove: handleTouchMove,
                    onTouchEnd: handleTouchEnd,
                  })}>
                  {config.type === 'item' && (
                    <ListItemContent
                      project={config.project}
                      index={config.index}
                      isHovered={hoveredItem?.id === config.project.id}
                      scrollDirection={scrollDirection}
                    />
                  )}
                  {config.type === 'empty' && (
                    <div className='list-item-empty'></div>
                  )}
                </ActivityBlock>
              ))}
            </div>
            <div className='WaveContainer'>
              <div
                className='WaveHelper'
                ref={waveBotRef}>
                <Wave
                  style={{ zIndex: '-1' }}
                  config={listWaveConfig}
                  colors={['#fff7ed', '#fff7ed']}
                  targetRef={waveBotRef}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className='more-activity-container'>
          <Magnetic>
            <ButtonReveal
              as='button'
              onClick={handleNavigate}
              className='more-activity-btn'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <Magnetic>
                <span>Explore Full Portfolio</span>
              </Magnetic>
            </ButtonReveal>
          </Magnetic>
        </div>
      </motion.main>
    </motion.div>
  );
};

export default Activity;
