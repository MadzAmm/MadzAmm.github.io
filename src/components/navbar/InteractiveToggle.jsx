import React, { useRef, useEffect, useState } from 'react';
// --- TAMBAHAN 1: Impor AnimatePresence ---
import { motion, useSpring } from 'framer-motion';
import './navbar.scss';

// --- TAMBAHAN 2: Impor Lottie dan file JSON Anda ---
// Pastikan Anda menginstal: npm install lottie-react
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// Ganti ini dengan path ke file Lottie JSON Anda

const InteractiveToggle = ({
  currentLink,
  recentLink,
  currentLinkPosition,
  onNavigate,
}) => {
  const containerRef = useRef(null);
  const [parentWidth, setParentWidth] = useState(0);
  const [hoveredButton, setHoveredButton] = useState(null);

  const PADDING = 5.5;
  const SNAP_THRESHOLD = 0.3;

  const x = useSpring(0, { stiffness: 600, damping: 20 });
  const scale = useSpring(1, { stiffness: 600, damping: 20 });

  // ... (useEffect untuk updateWidth tetap sama) ...
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setParentWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const numberOfOptions = recentLink ? 2 : 1;
  const effectiveWidth = parentWidth > 0 ? parentWidth - PADDING * 2 : 0;
  const itemWidth = numberOfOptions > 0 ? effectiveWidth / numberOfOptions : 0;

  // ... (useEffect untuk x.set tetap sama) ...
  useEffect(() => {
    if (itemWidth > 0) {
      const targetX = PADDING + currentLinkPosition * itemWidth;
      x.set(targetX);
    }
  }, [currentLinkPosition, itemWidth, x]);

  const leftLink = currentLinkPosition === 0 ? currentLink : recentLink;
  const rightLink = currentLinkPosition === 1 ? currentLink : recentLink;

  // ... (fungsi formatLinkText, leftDisplayText, rightDisplayText tetap sama) ...
  const formatLinkText = (link) => {
    if (typeof link !== 'string') {
      return '';
    }
    return link.replace(/\//g, ' ');
  };

  const leftDisplayText =
    leftLink === currentLink && leftLink === 'Homepage'
      ? 'Crafted by 마드잠'
      : formatLinkText(leftLink);

  const rightDisplayText =
    rightLink === currentLink && rightLink === 'Homepage'
      ? 'Crafted by 마드잠'
      : formatLinkText(rightLink);

  // ... (semua handler: handleMouseMove, handleMouseLeave, handleContainerClick, handleDragEnd tetap sama) ...
  const handleMouseMove = (event) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const hoverX = event.clientX - left;
    setHoveredButton(hoverX <= width / 2 ? 0 : 1);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  const handleContainerClick = (e) => {
    if (!containerRef.current || !recentLink || itemWidth === 0) return;
    scale.set(1.1);
    setTimeout(() => scale.set(1), 400);
    const { left } = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - left;
    const index = Math.floor((clickX - PADDING) / itemWidth);

    if (index === 1 && rightLink === recentLink) {
      onNavigate(rightLink);
    } else if (index === 0 && leftLink === recentLink) {
      onNavigate(leftLink);
    }
  };

  const handleDragEnd = (event, info) => {
    if (!recentLink || itemWidth === 0) return;
    const startIndex = currentLinkPosition;
    const endPosition =
      info.point.x - containerRef.current.getBoundingClientRect().left;
    const endFractionalIndex = (endPosition - PADDING) / itemWidth;
    const dragDistance = endFractionalIndex - startIndex;
    let newIndex = startIndex;
    if (dragDistance > SNAP_THRESHOLD) {
      newIndex = startIndex + 1;
    } else if (dragDistance < -SNAP_THRESHOLD) {
      newIndex = startIndex - 1;
    }
    newIndex = Math.max(0, Math.min(numberOfOptions - 1, newIndex));
    const newTargetX = PADDING + newIndex * itemWidth;
    x.stop();
    x.set(newTargetX);
    if (newIndex !== startIndex) {
      const linkToNavigate = newIndex === 0 ? leftLink : rightLink;
      onNavigate(linkToNavigate);
    }
  };

  // --- TAMBAHAN 3: Definisikan transisi "empuk" ---

  return (
    <motion.div
      className={`style-selector-navbar ${!recentLink ? 'single-item' : ''}`}
      layout // 'layout' penting untuk animasi perubahan ukuran
      ref={containerRef}
      onClick={handleContainerClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: recentLink ? 'pointer' : 'default' }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      // Transisi 'layout' untuk perubahan ukuran navbar
    >
      <motion.div
        className='active-bg'
        // 'layout' juga penting di sini untuk animasi slider

        style={{
          x,
          scale,
          width: itemWidth > 0 ? itemWidth : `calc(100% - ${PADDING * 2}px)`,
        }}
        drag={recentLink ? 'x' : false}
        dragConstraints={{
          left: PADDING,
          right: PADDING + (numberOfOptions - 1) * itemWidth,
        }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={() => recentLink && scale.set(1.1)}
        onPointerUp={() => scale.set(1)}
        // Transisi 'layout' untuk slider
      >
        {/* --- TAMBAHAN 4: Bungkus Lottie dengan AnimatePresence --- */}

        {!recentLink && (
          <motion.div
            key='lottie-icon'
            className='lottie-wrapper'
            // Animasi Masuk (Mengembang)
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            // Animasi Keluar (Mengecil)
            exit={{ scale: 0, opacity: 0 }}
            // Gunakan transisi "empuk"
          >
            <DotLottieReact
              src='/starGlobe.json'
              loop
              autoplay
            />
          </motion.div>
        )}
      </motion.div>

      {/* ... (Sisa JSX untuk .style-btn tetap sama) ... */}
      <div className={`style-btn ${hoveredButton === 0 ? 'is-hovered' : ''}`}>
        <div
          className='slot-viewport'
          data-text={leftDisplayText}>
          <span className='slot-text'>{leftDisplayText}</span>
        </div>
      </div>
      {recentLink && (
        <div className={`style-btn ${hoveredButton === 1 ? 'is-hovered' : ''}`}>
          <div
            className='slot-viewport'
            data-text={rightDisplayText}>
            <span className='slot-text'>{rightDisplayText}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default InteractiveToggle;
