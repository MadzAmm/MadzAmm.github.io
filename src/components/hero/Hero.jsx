import './hero.scss';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import Magnetic from '../DateBubble/Magnetic';

// ... (variants dan sliderVariants tetap sama)
const variants = {
  open: { transition: { staggerChildren: 0.1 } },
  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};
const itemVariants = {
  open: { y: 0, opacity: 1 },
  closed: { y: 200, opacity: 0 },
};
const sliderVariants = {
  initial: { x: 0 },
  animate: {
    x: '-50%',
    transition: {
      repeat: Infinity,
      duration: 30,
      repeatType: 'mirror',
    },
  },
};

// ==========================================================
// 1. KOMPONEN 'Block' BARU
// Komponen ini harus didefinisikan di luar 'Hero'
// agar tidak melanggar Aturan Hooks (Rules of Hooks).
// ==========================================================
const AnimatedBlock = ({ scrollProgress, config }) => {
  // 1. Ambil 'initialX' (posisi awal baru) dari config
  const {
    startX,
    endX,
    color,
    height,
    content: children,
    initialX, // <-- Prop baru, misal: '-100%'
  } = config;

  // 2. Animasi 'x' untuk scroll (tetap sama)
  const xScroll = useTransform(
    scrollProgress,
    [0, 1],
    [`${startX}%`, `${endX}%`]
  );

  return (
    // 3. INI ADALAH WRAPPER
    // Bertugas untuk animasi "masuk"
    <motion.div
      className='block-wrapper'
      style={{ height: height }} // Tinggi balok diatur di wrapper
      initial={{ x: initialX }} // Mulai dari 'initialX'
      animate={{ x: 0 }} // Animasikan ke '0'
      transition={{
        type: 'spring', // Ini akan memberikan efek 'kenyal'
        stiffness: 50, // Seberapa kaku pegasnya
        damping: 8, // Seberapa cepat berhenti memantul
      }}>
      {/* 4. INI ADALAH KONTEN/BALOK LAMA ANDA */}
      {/* Bertugas untuk animasi "scroll" */}
      <motion.div
        className='block-content'
        style={{
          x: xScroll, // <-- 'x' dari scroll diterapkan di sini
          backgroundColor: color,
        }}>
        {children}
      </motion.div>
    </motion.div>
  );
};
// ==========================================================
// KOMPONEN UTAMA 'Hero'
// ==========================================================
const Hero = ({ navState }) => {
  const ref = useRef(null);
  const { allNavItems, currentLink, recentLink, handleNavigate } = navState;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  const yText = useTransform(smoothScroll, [0, 1], ['0%', '-10%']);
  const yImage = useTransform(smoothScroll, [0, 1], ['0%', '20%']);
  const ySlidingText = useTransform(smoothScroll, [0, 1], ['0%', '-200%']);

  // Salin dari Links.jsx
  const socialLinks = [
    { name: 'Instagram', url: 'https://www.instagram.com/muhafasy' },
    { name: 'Github', url: 'https://github.com/MadzAmm/' },
    { name: 'Threads', url: 'https://www.threads.com/@muhafasy' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/madz-am-664983394' },
  ];

  const linksForBlok8 = allNavItems.filter(
    (item) => item !== currentLink && item !== recentLink
  );
  // 2. TENTUKAN KECEPATAN HORIZONTAL YANG BERBEDA UNTUK 10 BALOK
  // Angka positif bergerak ke kanan, angka negatif ke kiri.
  const blockConfigs = [
    // format: { startX, endX }
    {
      initialX: '-50%',
      startX: 35,
      endX: 50,
      color: '#fff7ed',
      height: '12%',
      content: null,
    }, // Balok 1: Mulai di 0, berakhir di 50
    {
      initialX: '100%',
      startX: 60,
      endX: 40,
      color: '#fff7ed',
      height: '8%',
      content: null,
    }, // Balok 2: Mulai dari kiri, berakhir di -30
    {
      initialX: '-100%',
      startX: -60,
      endX: -40,
      color: '#fff7ed',
      height: '10%',
      content: null,
    }, // Balok 3: Mulai di 30, berakhir di 80
    {
      initialX: '100%',
      startX: -50,
      endX: -40,
      color: '#fff7ed',
      height: '10%',
      content: null,
    }, // Balok 4: Mulai dari kiri
    {
      initialX: '-100%',
      startX: 40,
      endX: 65,
      color: '#fff7ed',
      height: '10%',
      content: null,
    }, // Balok 5: Mulai di 0
    {
      initialX: '100%',
      startX: -60,
      endX: -40,
      color: '#fff7ed',
      height: '10%',
      content: (
        <div className='social-links'>
          {socialLinks.map((link) => (
            <Magnetic
              key={link.name}
              pullForceParent={0.5}
              pullForceChild={0.25}>
              <a
                // key={link.name}
                href={link.url}
                target='_blank'
                rel='noopener noreferrer'>
                {/* {link.name} */}
                <div
                  className='slot-viewport'
                  data-text={link.name}>
                  <span className='slot-text'>{link.name}</span>
                </div>
              </a>
            </Magnetic>
          ))}
        </div>
      ),
    }, // Balok 6: Mulai jauh dari kiri
    {
      initialX: '-100%',
      startX: 50,
      endX: 60,
      color: '#fff7ed',
      height: '10%',
      content: null,
    }, // Balok 7: Mulai di 10, berakhir jauh di kanan
    {
      initialX: '100%',
      startX: 30,
      endX: 20,
      color: '#fff7ed',
      height: '10%',
      content: (
        <div className='nav-links'>
          {linksForBlok8.map((link) => (
            <Magnetic
              key={link}
              pullForceParent={0.5}
              pullForceChild={0.25}>
              <button
                // key={link}
                onClick={() => handleNavigate(link)}>
                {/* {link} */}
                <div
                  className='slot-viewport'
                  data-text={link}>
                  <span className='slot-text'>{link}</span>
                </div>
              </button>
            </Magnetic>
          ))}
        </div>
      ),
    }, // Balok 8
    {
      initialX: '-100%',
      startX: -20,
      endX: -10,
      color: '#fff7ed',
      height: '5%',
      content: null,
    }, // Balok 9
    {
      initialX: '100%',
      startX: -50,
      endX: -60,
      color: '#fff7ed',
      height: '10%',
      content: null,
    }, // Balok 10: Mulai dari kanan, berakhir di kiri
    {
      initialX: '-100%',
      startX: 0,
      endX: 10,
      color: '#fff7ed',
      height: '5%',
      content: null,
    }, // Balok 11: Mulai dari kanan, berakhir di kiri
  ];
  return (
    <motion.div
      variants={variants}
      initial='closed'
      animate='open'
      className='hero'
      ref={ref}>
      {/* ========================================================== */}
      {/* 3. TAMBAHKAN KONTAINER BALOK DI SINI */}
      {/* ========================================================== */}
      <motion.div className='blocksContainer'>
        {blockConfigs.map((config, index) => (
          <AnimatedBlock
            key={index}
            scrollProgress={smoothScroll}
            config={config} // Kirim seluruh objek config
          />
        ))}
      </motion.div>
      {/* ========================================================== */}
      <div className='wrapper'>
        <motion.div
          className='textContainer'
          variants={itemVariants}
          style={{ y: yText }}>
          <motion.h3 variants={itemVariants}>Next-Gen Professional</motion.h3>
        </motion.div>

        <motion.div
          className='imageContainer'
          variants={itemVariants}
          style={{ y: yImage }}>
          <motion.div
            className='slidingTextContainer'
            variants={sliderVariants}
            initial='initial'
            animate='animate'
            style={{ y: ySlidingText }} // 2. TERAPKAN STYLE DI SINI
          >
            무하마드*Muhammad
          </motion.div>
          <motion.img
            variants={itemVariants}
            src='/mad.png'
            alt='mad'
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            draggable='false'
            style={{
              WebkitTouchCallout: 'none',
              KhtmlUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              userSelect: 'none',
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;
