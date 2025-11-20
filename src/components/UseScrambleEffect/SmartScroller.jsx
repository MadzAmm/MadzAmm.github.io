import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Kumpulan karakter untuk reel acak
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// Jumlah karakter acak di atas karakter asli pada reel awal
const INITIAL_REEL_LENGTH = 15;
// Kecepatan looping (semakin tinggi nilainya, semakin lambat)
const LOOP_DURATION = 50;

/**
 * Komponen SmartScroller untuk animasi teks bergulir yang canggih dan multi-fase.
 */
export const SmartScroller = ({
  as: Component = motion.h1,
  children,
  ...rest
}) => {
  // State untuk mengontrol fase animasi: 'initial', 'looping'
  const [animationState, setAnimationState] = useState('initial');
  // State untuk interaksi hover/tap
  const [isHovered, setIsHovered] = useState(false);

  // Fungsi untuk membuat "reel" karakter untuk setiap huruf
  const generateReel = (character, length) => {
    const reel = Array.from(
      { length },
      () => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
    );
    reel.push(character);
    return reel;
  };

  // Memo-isasi reels agar tidak dibuat ulang pada setiap render
  const characterReels = useMemo(() => {
    return Array.from(children).map((char) =>
      char === ' ' ? ['\u00A0'] : generateReel(char, INITIAL_REEL_LENGTH)
    );
  }, [children]);

  // Mengatur siklus hidup animasi: Initial Reveal -> Jeda -> Looping
  useEffect(() => {
    // Setelah animasi awal selesai, tunggu beberapa saat lalu masuk ke mode looping
    const timeout = setTimeout(() => {
      setAnimationState('looping');
    }, 2000 + children.length * 80); // Jeda 2 detik + waktu stagger

    return () => clearTimeout(timeout);
  }, [children]);

  return (
    <Component
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        display: 'flex',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      {...rest}>
      {characterReels.map((reel, charIndex) => {
        const charHeight = '1em'; // Sesuaikan dengan font-size
        const targetIndex = reel.length - 1;
        const reelHeight = reel.length * parseFloat(charHeight);

        // Logika untuk menentukan posisi Y dari reel
        const animateY = () => {
          // Jika di-hover atau ini adalah animasi awal, tunjukkan karakter asli
          if (isHovered || animationState === 'initial') {
            return `-${(targetIndex * 100) / reel.length}%`;
          }
          // Jika looping, animasikan dari atas ke bawah
          return [`0%`, `-${((reel.length - 1) * 100) / reel.length}%`];
        };

        // Logika untuk transisi yang berbeda di setiap fase
        const transition = () => {
          if (isHovered || animationState === 'initial') {
            return {
              type: 'spring',
              damping: 40,
              stiffness: 50,
              delay: charIndex * 0.08, // Efek stagger
            };
          }
          return {
            duration: LOOP_DURATION,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * -LOOP_DURATION, // Mulai loop dari posisi acak
          };
        };

        return (
          <span
            key={charIndex}
            style={{
              display: 'inline-block',
              height: charHeight,
              overflow: 'hidden',
            }}>
            <motion.span
              style={{ display: 'block' }}
              animate={{ y: animateY() }}
              transition={transition()}>
              {reel.map((char, itemIndex) => (
                <span
                  key={itemIndex}
                  style={{ display: 'block', height: charHeight }}>
                  {char}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </Component>
  );
};
