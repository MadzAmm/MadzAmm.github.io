import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './StickyTextMerge.scss';

// --- CONFIGURATION ---
const animationConfig = {
  mobile: { scaleTarget: 150, textY: '20vh', fontSize: '7.8' },
  tablet: { scaleTarget: 100, textY: '25vh', fontSize: '45' },
  desktop: { scaleTarget: 80, textY: '30vh', fontSize: '20' }, // Scale lebih kecil di desktop krn layar lebar
};

const getBreakpoint = (width) => {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

const StickyTextMerge = () => {
  const targetRef = useRef(null);
  const [breakpoint, setBreakpoint] = useState(() =>
    getBreakpoint(window.innerWidth)
  );

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint(window.innerWidth));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const config = animationConfig[breakpoint];

  // Scroll Progress
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // --- ANIMASI HELPER TEXT (TOP & BOTTOM) ---
  // Mereka bergerak menjauh (ke atas dan ke bawah) sebelum zoom terjadi
  const yTop = useTransform(scrollYProgress, [0.1, 0.4], ['-200%', '0%']);
  const yBottom = useTransform(scrollYProgress, [0.1, 0.4], ['200%', '0%']);
  const opacitySide = useTransform(scrollYProgress, [0.3, 0.38], [1, 0]);

  // --- ANIMASI UTAMA (SVG MASK SCALE) ---
  // Kita mulai zoom dari scroll 40% sampai 85%
  // Scale mulai dari 1 (normal) ke target (sangat besar)
  const maskScale = useTransform(
    scrollYProgress,
    [0.4, 0.9],
    [1, config.scaleTarget]
  );

  // Opacity masker: Hilang di akhir agar background belakang benar-benar bersih
  const maskOpacity = useTransform(scrollYProgress, [0.85, 0.95], [1, 0]);

  // --- ANIMASI KONTEN BARU (KOREA) ---
  // Muncul pelan-pelan saat kita masuk ke dalam lubang teks
  const newTextOpacity = useTransform(scrollYProgress, [0.6, 0.9], [0, 1]);
  const newTextScale = useTransform(scrollYProgress, [0.6, 1], [0.5, 1]);

  return (
    <section
      ref={targetRef}
      className='text-merge-section'>
      <div className='sticky-wrapper'>
        {/* --- LAYER 1: REVEAL CONTENT (BELAKANG) --- */}
        <div className='reveal-layer'>
          <motion.h1
            className='madzam-text'
            style={{ opacity: newTextOpacity, scale: newTextScale }}>
            무함마드
          </motion.h1>
        </div>

        {/* --- LAYER 2: SVG MASK (DEPAN) --- */}
        {/* Ini adalah layer hitam penuh dengan "Lubang" berbentuk teks */}
        <motion.div
          className='mask-layer-container'
          style={{
            scale: maskScale,
            opacity: maskOpacity,
            transformOrigin: 'center center', // Zoom tepat ke tengah
          }}>
          {/* viewBox kecil agar teks presisi, width/height 100% mengikuti container */}
          <svg
            viewBox='0 0 400 100'
            preserveAspectRatio='xMidYMid slice'>
            <defs>
              {/* Definisi Masker: Putih = Visible, Hitam = Bolong/Invisible */}
              <mask id='text-mask'>
                {/* 1. Kotak Putih Penuh (Layar Solid) */}
                <rect
                  x='-50%'
                  y='-50%'
                  width='200%'
                  height='200%'
                  fill='white'
                />

                {/* 2. Teks Hitam (Akan menjadi lubang transparan) */}
                <text
                  x='50%'
                  y='50%'
                  textAnchor='middle'
                  dominantBaseline='middle'
                  fontSize={config.fontSize}
                  fontWeight='900'
                  fill='black'
                  fontFamily='system-ui, sans-serif' // Ganti dengan font Anda
                >
                  BE OPEN
                </text>
              </mask>
            </defs>

            {/* Rect Utama: Warnanya Hitam (#0a0a0a) mengikuti tema awal */}
            {/* Rect ini diaplikasikan mask di atas, sehingga bolong di tengah */}
            <rect
              x='-50%'
              y='-50%'
              width='200%'
              height='200%'
              fill='#0a0a0a'
              mask='url(#text-mask)'
            />
          </svg>
        </motion.div>

        {/* --- LAYER 3: HELPER TEXT (TOP & BOTTOM) --- */}
        {/* Elemen HTML biasa di atas SVG, bergerak pergi saat scroll */}
        <motion.div
          className='helper-text'
          style={{ y: yTop, opacity: opacitySide }}>
          BE OPEN
        </motion.div>

        <motion.div
          className='helper-text'
          style={{ y: yBottom, opacity: opacitySide }}>
          BE OPEN
        </motion.div>
      </div>
    </section>
  );
};

export default StickyTextMerge;
