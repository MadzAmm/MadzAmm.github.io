import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Komponen Section yang sudah diperbaiki
const Section = ({
  scrollYProgress,
  start,
  end,
  zIndex,
  isInteractive,
  children,
}) => {
  const duration = end - start;
  const inputRange = [start, start + duration * 0.5, end, end + duration];
  const y = useTransform(scrollYProgress, inputRange, [
    '60%',
    '0%',
    '0%',
    '-100%',
  ]);

  // Pastikan children adalah elemen React yang valid
  if (!React.isValidElement(children)) {
    return null;
  }

  return (
    // 1. KEMBALIKAN motion.div sebagai pembungkus utama untuk menangani animasi.
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        y, // 'y' sekarang bisa dipahami oleh motion.div
        zIndex,
        pointerEvents: isInteractive ? 'auto' : 'none',
      }}>
      {/* 2. GUNAKAN cloneElement untuk menyuntikkan style ke child.
           Ini memastikan child mengisi penuh motion.div di atasnya,
           sehingga media query di dalam child bisa berfungsi dengan benar.
           Tidak ada lagi div pembungkus tambahan di sini.
      */}
      {React.cloneElement(children, {
        style: {
          ...children.props.style,
          width: '100%',
          height: '100%',
          display: 'flex', // Opsional: Tambahkan kembali flex untuk centering jika perlu
          justifyContent: 'center',
          alignItems: 'center',
        },
      })}
    </motion.div>
  );
};

// Komponen ParallaxScroller (tidak ada perubahan di sini)
export const ParallaxScroller = ({ children, defaultSectionHeight = 75 }) => {
  const containerRef = useRef(null);
  const totalSections = React.Children.count(children);

  const { sectionProgressRanges, totalHeight } = useMemo(() => {
    let cumulativeHeight = 0;
    const heights = React.Children.map(
      children,
      (child) => child.props.height || defaultSectionHeight
    );

    const totalScrollableHeight = heights.reduce(
      (sum, height) => sum + height,
      0
    );

    const ranges = heights.map((height) => {
      const start = cumulativeHeight / totalScrollableHeight;
      cumulativeHeight += height;
      const end = cumulativeHeight / totalScrollableHeight;
      return { start, end };
    });

    return {
      sectionProgressRanges: ranges,
      totalHeight: totalScrollableHeight + 100, // +100vh untuk section terakhir keluar
    };
  }, [children, defaultSectionHeight]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div
      ref={containerRef}
      style={{
        height: `${totalHeight}vh`,
        position: 'relative',
      }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}>
        {React.Children.map(children, (child, i) => (
          <Section
            key={i}
            scrollYProgress={scrollYProgress}
            start={sectionProgressRanges[i]?.start || 0}
            end={sectionProgressRanges[i]?.end || 0}
            zIndex={totalSections - i}
            isInteractive={child.props.interactive || false}>
            {child}
          </Section>
        ))}
      </div>
    </div>
  );
};
