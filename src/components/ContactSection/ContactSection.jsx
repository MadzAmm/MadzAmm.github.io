// import React, { useRef } from 'react';
// import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
// import './ContactSection.scss';
// import Magnetic from '.././DateBubble/Magnetic';
// import Velocity from '../velocity/Velocity';
// import { AnimateInteractiveText } from '../AnimatedText/AnimateInteractiveText ';
// import { ButtonReveal } from '../buttonReveal/ButtonReveal';

// const contactDetails = {
//   email: 'yahdien04@gmail.com',
//   phone: '+62 896 6434 8459',
// };
// const ContactSection = () => {
//   // Varian animasi untuk kontainer utama
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   // Varian animasi untuk setiap kata pada judul
//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: 'spring',
//         stiffness: 100,
//         damping: 10,
//       },
//     },
//   };

//   // Varian animasi untuk tombol "Get in touch"
//   const buttonVariants = {
//     hidden: { scale: 0, opacity: 0 },
//     visible: {
//       scale: 1,
//       opacity: 1,
//       transition: {
//         type: 'spring',
//         stiffness: 150,
//         damping: 12,
//         delay: 0.8,
//       },
//     },
//     hover: {
//       scale: 1.05,
//       transition: {
//         type: 'spring',
//         stiffness: 300,
//         damping: 10,
//       },
//     },
//     tap: { scale: 0.95 },
//   };

//   // Varian animasi untuk garis horizontal
//   const lineVariants = {
//     hidden: { width: 0, opacity: 0 },
//     visible: {
//       width: '100%',
//       opacity: 1,
//       transition: {
//         duration: 0.8,
//         ease: 'easeInOut',
//         delay: 0.6,
//       },
//     },
//   };

//   const profileImage = 'm10.png'; // Placeholder gambar profil

//   const ref = useRef(null);

//   const { scrollYProgress } = useScroll({
//     target: ref,
//     offset: ['start end', 'start start'],
//   });

//   const smoothScroll = useSpring(scrollYProgress, {
//     stiffness: 200, // Kekakuan (semakin tinggi, semakin kaku)
//     damping: 50, // Redaman (semakin tinggi, semakin 'mulus' tapi ada delay)
//     restDelta: 0.001,
//   });

//   const yHeader = useTransform(smoothScroll, [0, 1], ['-30vw', '0vw']);
//   const xContact = useTransform(smoothScroll, [0, 1], ['30vw', '0vw']);

//   return (
//     <div
//       className='contact-section-container'
//       ref={ref}>
//       {/* Konten Utama */}
//       <div className='main-content'>
//         <motion.div
//           className='header'
//           style={{ y: yHeader }}>
//           <motion.img
//             src={profileImage}
//             alt='Profile'
//             onContextMenu={(e) => e.preventDefault()} // Mencegah klik kanan
//             onDragStart={(e) => e.preventDefault()} // Mencegah drag
//             draggable='false' //mencegah drag di beberapa browser yang berbasis webkit (chrome, safari)
//             className='profile-image'
//             style={{
//               WebkitTouchCallout: 'none', // <- Properti Kunci img untuk iOS
//               KhtmlUserSelect: 'none',
//               MozUserSelect: 'none',
//               msUserSelect: 'none',
//               userSelect: 'none',
//             }}
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{
//               type: 'spring',
//               stiffness: 200,
//               damping: 15,
//               delay: 0.2,
//             }}
//           />
//           <motion.h1
//             className='main-title'
//             variants={containerVariants}
//             initial='hidden'
//             animate='visible'>
//             {"Let's work together".split(' ').map((word, i) => (
//               <motion.span
//                 key={i}
//                 className='word'
//                 variants={itemVariants}>
//                 {word}
//               </motion.span>
//             ))}
//           </motion.h1>
//         </motion.div>

//         {/* Garis dan Tombol "Get in touch" */}
//         <div className='line-container'>
//           <motion.div
//             className='horizontal-line'
//             variants={lineVariants}
//             initial='hidden'
//             animate='visible'></motion.div>
//         </div>

//         {/* Tombol Info Kontak */}
//         <motion.div
//           className='contact-info-buttons'
//           style={{ x: xContact }}>
//           <Magnetic
//             pullForceParent={0.25}
//             pullForceChild={0.5}>
//             <motion.div
//               whileHover={{ color: 'white', scale: 1.1 }}
//               whileTap={{ scale: 0.85 }}>
//               <ButtonReveal
//                 as='a'
//                 href={`mailto:${contactDetails.email}`}
//                 className='info-button'>
//                 <Magnetic>
//                   <span>{contactDetails.email}</span>
//                 </Magnetic>
//               </ButtonReveal>
//             </motion.div>
//           </Magnetic>
//           <Magnetic>
//             <motion.div
//               whileHover={{
//                 color: 'white',
//                 scale: 1.1,
//               }}
//               whileTap={{ scale: 0.85 }}>
//               <ButtonReveal
//                 as='a'
//                 href={`tel:${contactDetails.phone.replace(/\s/g, '')}`}
//                 className='info-button'>
//                 <Magnetic>
//                   <span>{contactDetails.phone}</span>
//                 </Magnetic>
//               </ButtonReveal>
//             </motion.div>
//           </Magnetic>
//           {/* Panah Dekoratif */}
//           <motion.div
//             className='decorative-arrow'
//             initial={{ opacity: 0, scale: 0.5 }}
//             animate={{ opacity: 0.3, scale: 1 }}
//             transition={{ duration: 0.8, delay: 1 }}>
//             &larr;
//           </motion.div>
//         </motion.div>
//       </div>
//       <motion.div className='velocity'>
//         <Velocity />
//       </motion.div>
//     </div>
//   );
// };

// export default ContactSection;

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import './ContactSection.scss';
import Magnetic from '../DateBubble/Magnetic';
import Velocity from '../velocity/Velocity';
import { ButtonReveal } from '../buttonReveal/ButtonReveal';

const contactDetails = {
  email: 'yahdien04@gmail.com',
  phone: '+62 896 6434 8459',
};

// ==========================================================
// KOMPONEN 'AnimatedBlock' (Diadaptasi dari Hero)
// ==========================================================
const AnimatedBlock = ({ scrollProgress, config }) => {
  const { startX, endX, color, height, content: children, initialX } = config;

  // Transformasi posisi X berdasarkan scroll
  const xScroll = useTransform(
    scrollProgress,
    [0, 1],
    [`${startX}%`, `${endX}%`]
  );

  return (
    <div
      className='block-wrapper'
      style={{ height: height }} // Tinggi blok
    >
      <motion.div
        className='block-content'
        initial={{ x: initialX }}
        whileInView={{ x: '0%' }} // Animasi masuk saat terlihat
        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 50,
          damping: 20,
          delay: 0.1,
        }}
        style={{
          x: xScroll, // Efek Parallax Scroll
          backgroundColor: color,
        }}>
        {children}
      </motion.div>
    </div>
  );
};

// ==========================================================
// KOMPONEN UTAMA ContactSection
// ==========================================================
const ContactSection = () => {
  const ref = useRef(null);
  const profileImage = 'm10.png';

  // 1. Setup Scroll Animation
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Animasi Header (Header bergerak sedikit ke atas saat scroll)
  const yHeader = useTransform(smoothScroll, [0, 1], ['50%', '-70%']);

  // 2. Konfigurasi 5 Blok
  const blockConfigs = [
    {
      // BLOK 1: Kosong
      initialX: '-100%',
      startX: -80,
      endX: -60,
      color: '#fff7ed', // Warna gelap (sesuaikan tema)
      height: '10%', // Tinggi relatif terhadap container blok
      content: null,
    },
    {
      // BLOK 2: EMAIL BUTTON
      initialX: '100%',
      startX: 60,
      endX: 50,
      color: '#fff7ed',
      height: '20%',
      content: (
        <div className='contact-item-wrapper'>
          <Magnetic
            pullForceParent={0.3}
            pullForceChild={0.5}>
            <ButtonReveal
              as='a'
              href={`mailto:${contactDetails.email}`}
              className='info-button'>
              <span>{contactDetails.email}</span>
            </ButtonReveal>
          </Magnetic>
        </div>
      ),
    },
    {
      // BLOK 3: Kosong (Pemisah)
      initialX: '-100%',
      startX: -80,
      endX: -20,
      color: '#fff7ed',
      height: '10%',
      content: null,
    },
    {
      // BLOK 4: PHONE BUTTON
      initialX: '100%',
      startX: -50,
      endX: -60,
      color: '#fff7ed',
      height: '25%',
      content: (
        <div className='contact-item-wrapper-phone'>
          <Magnetic
            pullForceParent={0.3}
            pullForceChild={0.5}>
            <ButtonReveal
              as='a'
              href={`tel:${contactDetails.phone.replace(/\s/g, '')}`}
              className='info-button'>
              <span>{contactDetails.phone}</span>
            </ButtonReveal>
          </Magnetic>
        </div>
      ),
    },
    {
      // BLOK 5: Kosong
      initialX: '-100%',
      startX: 80,
      endX: 30,
      color: '#252529ff',
      height: '10%',
      content: null,
    },
  ];

  return (
    <div
      className='contact-section-container'
      ref={ref}>
      {/* --- BAGIAN ATAS (Header) --- */}
      <motion.div
        className='header-area'
        style={{ y: yHeader }}>
        <motion.img
          src={profileImage}
          alt='Profile'
          className='profile-image'
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        />
        <h1 className='main-title'>Let's work together</h1>
      </motion.div>

      {/* --- BAGIAN TENGAH (5 BLOK PARALLAX) --- */}
      <div className='parallax-blocks-container'>
        {blockConfigs.map((config, index) => (
          <AnimatedBlock
            key={index}
            scrollProgress={smoothScroll}
            config={config}
          />
        ))}
      </div>

      {/* --- BAGIAN BAWAH (Velocity / Footer Decor) --- */}
      <div className='footer-area'>
        <Velocity />
      </div>
    </div>
  );
};

export default ContactSection;
