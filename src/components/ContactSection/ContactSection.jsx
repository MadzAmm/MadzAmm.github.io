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
  const { startX, endX, color, height, content: children } = config;

  // Transformasi posisi X berdasarkan scroll
  const xScroll = useTransform(
    scrollProgress,
    [0, 1],
    [`${startX}%`, `${endX}%`]
  );

  return (
    <div
      className='block-wrapper'
      style={{ height: height }}>
      <motion.div
        className='block-content'
        // --- BAGIAN YANG DIPERBAIKI ---
        // Hapus 'x' dari sini agar tidak bentrok dengan xScroll
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        // ------------------------------

        viewport={{ once: true }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 50,
          restDelta: 0.001,
        }}
        style={{
          x: xScroll, // Biarkan ini menjadi satu-satunya penguasa posisi X
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

      startX: -80,
      endX: -60,
      color: 'rgba(197, 197, 198, 0.2)', // Warna gelap (sesuaikan tema)
      height: '10%', // Tinggi relatif terhadap container blok
      content: null,
    },
    {
      // BLOK 2: EMAIL BUTTON

      startX: 60,
      endX: 40,
      color: 'rgba(197, 197, 198, 0.2)',
      height: '25%',
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

      startX: -80,
      endX: 0,
      color: 'rgba(197, 197, 198, 0.2)',
      height: '10%',
      content: null,
    },
    {
      // BLOK 4: PHONE BUTTON

      startX: -80,
      endX: -30,
      color: 'rgba(197, 197, 198, 0.2)',
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

      startX: 80,
      endX: 30,
      color: 'rgba(197, 197, 198, 0.2)',
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
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 50,
            restDelta: 0.001,
          }}
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
