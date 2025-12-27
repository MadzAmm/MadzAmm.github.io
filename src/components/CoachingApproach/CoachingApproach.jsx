import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useAnimation,
} from 'framer-motion';
import Magnetic from '../DateBubble/Magnetic';
import Wave from '../MorphingWave/Wave';
import './CoachingApproach.scss';

const WaveConfig = {
  initialY: { desktop: 1100, tablet: 1400, mobile: 350 },
  finalY: { desktop: 1100, tablet: 1450, mobile: 200 },
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
      desktop: [700, 600, 550],
      tablet: [650, 650, 550],
      mobile: [550, 650, 550],
    },
  },
  springConfig: { stiffness: 10000, damping: 500 },
};

// --- HOOK untuk mendeteksi ukuran layar ---
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Data konten
const approachItems = [
  {
    number: '01',
    title: 'Fast Learner',
    description:
      'Quickly grasps new concepts and applies them with precision. Adaptable and intuitive—able to adjust strategies on the fly, connect ideas fluidly, and consistently deliver high-quality results with minimal guidance.',
  },
  {
    number: '02',
    title: 'Tech-Savvy',
    description:
      'Blending logic-technical expertise, and creative intuition to design modular, efficient, and scalable workflows. Transforms complexity into adaptive, future-proof systems. Tools aren’t just instruments—they’re mediums for crafting elegant efficiency.',
  },
  {
    number: '03',
    title: 'Meticulous',
    description:
      'Maintains impeccable organization across every space and task, guided by a methodical mindset. Potential pitfalls are anticipated, every detail is double-checked, and polished, error-free results are consistently delivered',
  },
  {
    number: '04',
    title: 'Caffeine Addict',
    description:
      'Coffee in hand, ideas in mind, growth in progress. Coffee keeps me awake, but curiosity keeps me alive. Every step I take is a chance to learn something new, and every mistake is a chance to grow.',
  },
  {
    number: '05',
    title: 'ISTJ-Type Man',
    description:
      'Maintains impeccable organization across every space and task, guided by a methodical mindset. Potential pitfalls are anticipated, every detail is double-checked, and polished, error-free results are consistently delivered',
  },
];

// Komponen untuk animasi teks per kata (dengan perbaikan spasi)
const AnimatedText = ({ text }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.02 },
    },
  };
  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const words = text.split(' ');
  return (
    <motion.p
      style={styles.description}
      variants={containerVariants}
      initial='hidden'
      animate='visible'>
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <span style={{ display: 'inline-block', overflow: 'hidden' }}>
            <motion.span
              style={{ display: 'inline-block' }}
              variants={childVariants}>
              {word}
            </motion.span>
          </span>{' '}
          {/* Spasi ditambahkan kembali di sini */}
        </React.Fragment>
      ))}
    </motion.p>
  );
};

// Komponen untuk setiap baris item (responsif)
const ApproachItem = ({ item, isMobile, isOpen, onToggle, isLast }) => {
  const { number, title, description } = item;

  const accordionVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      marginTop: '20px',
      transition: { duration: 0.4, ease: 'easeInOut' },
    },
  };

  const desktopItemVariants = {
    hidden: { opacity: 0, y: 75 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  if (isMobile) {
    // Tampilan Accordion untuk Mobile
    return (
      <div
        style={
          isLast ? styles.mobileItemContainer_last : styles.mobileItemContainer
        }
        layout='position'
        transition={{ duration: 0.5, type: 'spring' }}>
        <div
          onClick={onToggle}
          style={styles.accordionHeader}>
          <div style={styles.leftColumn}>
            <span style={styles.number}>{number}</span>
            <h2
              className='title-accordion'
              style={{ ...styles.title, fontSize: '25px' }}>
              {title}
            </h2>
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              style={styles.accordionContent}
              variants={accordionVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'>
              <p style={styles.description}>{description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Tampilan Dua Kolom untuk Desktop
  return (
    <motion.div
      style={
        isLast ? styles.desktopItemContainer_last : styles.desktopItemContainer
      }
      variants={desktopItemVariants}>
      <div style={styles.leftColumn}>
        <span style={styles.number}>{number}</span>
        <Magnetic>
          <h2 style={styles.title}>{title}</h2>
        </Magnetic>
      </div>
      <div style={styles.rightColumn}>
        <AnimatedText text={description} />
      </div>
    </motion.div>
  );
};

// Komponen Utama
const CoachingApproach = () => {
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const waveRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible');
    }
  }, [isInView, mainControls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: isMobile ? 0.2 : 0.4 },
    },
  };

  return (
    <div
      ref={ref}
      style={styles.mainContainer}>
      <p style={styles.header}>Creative Vision, Skilled Execution</p>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate={mainControls}>
        {approachItems.map((item, index) => (
          <ApproachItem
            key={item.number}
            item={item}
            isMobile={isMobile}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
            isLast={index === approachItems.length - 1}
          />
        ))}
      </motion.div>
      <div ref={waveRef}>
        <Wave
          config={WaveConfig}
          colors={['#fff7ed', '#fff7ed']}
          targetRef={waveRef}
        />
      </div>
    </div>
  );
};

// Styling akhir
const styles = {
  mainContainer: {
    backgroundColor: 'rgba(255, 247, 237, 0)',
    padding: '80px clamp(20px, 5vw, 60px)',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: '#002f45',
    // overflow: 'hidden',
    position: 'relative',
  },
  header: {
    color: '#FF4D4D',
    fontWeight: 'bold',
    letterSpacing: '1.5px',
    marginBottom: '60px',
    fontSize: '14px',
  },
  desktopItemContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '5%',
    padding: '60px 0',
    borderBottom: '1px solid #EAE0D4',
  },
  mobileItemContainer: {
    padding: '30px 0',
    borderBottom: '1px solid #EAE0D4',
    cursor: 'pointer',
  },
  accordionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  accordionContent: {
    overflow: 'hidden',
  },
  leftColumn: {
    flex: '1.2',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '25px',
  },
  rightColumn: {
    flex: '1',
    paddingTop: '10px',
  },
  number: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#FF4D4D',
  },
  title: {
    fontWeight: '900',
    lineHeight: '0.95',
    margin: '0',
    fontSize: '40px',
  },
  description: {
    paddingLeft: '50px',
    paddingRight: '20px',
    fontSize: '15px',
    // lineHeight: '1.6',
    margin: '0',
    maxWidth: '500px',
    color: '#4a4a4aff',
  },
};
styles.desktopItemContainer_last = {
  ...styles.desktopItemContainer,
  borderBottom: 'none',
};
styles.mobileItemContainer_last = {
  ...styles.mobileItemContainer,
  borderBottom: 'none',
};

export default CoachingApproach;
