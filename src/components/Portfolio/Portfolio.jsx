import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useSpring,
  useTransform,
  useScroll,
  useMotionValue,
  useAnimationFrame,
  animate,
} from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import './Portfolio.scss';
import Magnetic from '../DateBubble/Magnetic';
import Wave from '../MorphingWave/Wave';
import { ButtonReveal } from '../buttonReveal/ButtonReveal';
import { MasterData } from '../../data/MasterData';

// --- Wave Configs ---
const listWaveConfig = {
  initialY: { desktop: -300, tablet: -300, mobile: -400 },
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
      desktop: [680, 730, 550],
      tablet: [650, 650, 550],
      mobile: [550, 650, 550],
    },
  },
  springConfig: { stiffness: 10000, damping: 500 },
};
const GridWaveConfig = {
  initialY: { desktop: -300, tablet: -300, mobile: -400 },
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
      desktop: [680, 730, 550],
      tablet: [650, 650, 550],
      mobile: [550, 650, 550],
    },
  },
  springConfig: { stiffness: 10000, damping: 500 },
};
const SlideWaveConfig = {
  initialY: { desktop: -300, tablet: -300, mobile: -400 },
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
      desktop: [680, 730, 550],
      tablet: [650, 650, 550],
      mobile: [550, 650, 550],
    },
  },
  springConfig: { stiffness: 10000, damping: 200 },
};

// --- HELPER UTILITY & HOOKS ---
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
};
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
const AnimatedArrowIcon = ({ isOpen }) => (
  <motion.svg
    xmlns='http://www.w3.org/2000/svg'
    width='12'
    height='12'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='3'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='arrow-svg'
    variants={{ open: { rotate: 180 }, closed: { rotate: 0 } }}
    transition={{ duration: 0.2, ease: 'easeInOut' }}
    animate={isOpen ? 'open' : 'closed'}>
    {' '}
    <polyline points='6 9 12 15 18 9'></polyline>{' '}
  </motion.svg>
);
const SlotText = ({ children }) => (
  <div
    className='slot-viewport'
    data-text={Array.isArray(children) ? children.join('') : children || ''}>
    {' '}
    <span className='slot-text'>{children || ''}</span>{' '}
  </div>
);

// --- DATA & VARIANTS ---
// const projectData = [
//   {
//     id: 1,
//     title: 'The Damai',
//     category: ['design', 'development'],
//     year: 2024,
//     imageUrl: 'hand.jpg',
//   },
//   {
//     id: 2,
//     title: 'FABRIC™',
//     category: ['design', 'development'],
//     year: 2023,
//     imageUrl: 'child.png',
//   },
//   {
//     id: 3,
//     title: 'Base',
//     category: ['development', 'design'],
//     year: 2023,
//     imageUrl: 'audit.png',
//   },
//   {
//     id: 4,
//     title: 'Bonus',
//     category: ['design'],
//     year: 2022,
//     imageUrl: 'momChild.png',
//   },
//   {
//     id: 5,
//     title: 'Studio',
//     category: ['design'],
//     year: 2022,
//     imageUrl: 'm.png',
//   },
//   {
//     id: 6,
//     title: 'Archive',
//     category: ['development'],
//     year: 2021,
//     imageUrl: 'u.png',
//   },
//   {
//     id: 7,
//     title: 'React Course',
//     category: ['learning'],
//     year: 2025,
//     imageUrl: 'mum.jpg',
//   },
//   {
//     id: 8,
//     title: 'Lead Developer at TechCorp',
//     category: ['experience'],
//     year: 2024,
//     imageUrl: 'fil.png',
//   },
//   {
//     id: 9,
//     title: 'WebAward 2023',
//     category: ['achievements'],
//     year: 2023,
//     imageUrl: 'kkn.jpg',
//   },
//   {
//     id: 10,
//     title: 'AWS Certified Developer',
//     category: ['credentials'],
//     year: 2025,
//     imageUrl: 'pbak.jpg',
//   },
//   {
//     id: 11,
//     title: 'Vue.js Workshop',
//     category: ['learning'],
//     year: 2024,
//     imageUrl: 'library.jpg',
//   },
// ];

const projectData = MasterData;

const marqueeText =
  'Let us collaborate and create something exceptional together.';
const variants = {
  open: { transition: { staggerChildren: 0.1 } },
  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};
const itemVariants = {
  open: { y: 0, opacity: 1 },
  closed: { y: 300, opacity: 0 },
};

// --- KOMPONEN BARU & YANG DIPERBARUI UNTUK MODE LIST ---
const MarqueeText = ({ text, direction }) => {
  const BASE_VELOCITY = 80;
  const marqueeX = useMotionValue(0);
  const velocity = useSpring(
    direction === 'down' ? -BASE_VELOCITY : BASE_VELOCITY,
    { stiffness: 80, damping: 40, mass: 2 }
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
      {' '}
      <motion.div
        className='marquee-track'
        style={{ x }}>
        <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
          {textContent.repeat(10)}
        </span>{' '}
        <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
          {textContent.repeat(10)}
        </span>{' '}
      </motion.div>{' '}
    </div>
  );
};
const ListItem = ({
  project,
  index,
  onClick,
  isHovered,
  scrollDirection,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  return (
    <motion.div
      className='list-item'
      style={{ touchAction: 'pan-y' }}
      onMouseEnter={() => onMouseEnter(project)}
      onMouseLeave={onMouseLeave}
      onTouchStart={(e) => onTouchStart(e, project)}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={() => onClick(project)}
      initial={{ opacity: 0.5, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}>
      <motion.span
        className='list-item-number'
        animate={{ opacity: isHovered ? 0 : 1, scale: isHovered ? 0.8 : 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}>
        {' '}
        {String(index + 1).padStart(2, '0')}{' '}
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
        {' '}
        {project.year}{' '}
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
    </motion.div>
  );
};
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
      {' '}
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
          {' '}
          <AnimatePresence>
            {' '}
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
            />{' '}
            <Magnetic>
              {' '}
              <motion.div
                className='teaser-view-button'
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.1, duration: 0.3, ease: 'backOut' }}>
                {' '}
                <Magnetic>
                  <span>View</span>
                </Magnetic>{' '}
              </motion.div>{' '}
            </Magnetic>{' '}
          </AnimatePresence>{' '}
        </motion.div>
      )}{' '}
    </AnimatePresence>
  );
};

// --- SISA KOMPONEN ---
// --- KOMPONEN SLIDER CERDAS (DIOPTIMALKAN UNTUK LAYAR SENTUH) ---
const InteractiveSlider = ({
  children,
  scrollDirection,
  onDragStateChange,
  baseVelocity = 15,
}) => {
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);
  const velocityRef = useRef(0);
  const speed = scrollDirection === 'down' ? -baseVelocity : baseVelocity;

  // PERBAIKAN 1: Faktor pengali untuk drag, terutama di layar sentuh
  const DRAG_FACTOR = 1.5;

  useEffect(() => {
    if (onDragStateChange) {
      onDragStateChange(isDragging);
    }
  }, [isDragging, onDragStateChange]);

  useAnimationFrame((time, delta) => {
    if (!trackRef.current) return;
    const trackWidth = trackRef.current.offsetWidth / 4;
    if (trackWidth === 0) return;

    let moveBy = 0;

    if (!isDragging) {
      if (Math.abs(velocityRef.current) > 0.1) {
        // PERBAIKAN 2: Logika inersia yang lebih konsisten
        // Kecepatan dikalikan dengan delta time untuk gerakan yang mulus berbasis frame
        moveBy = velocityRef.current * (delta / 1000);
        velocityRef.current *= 0.95; // Gesekan/friksi
      } else {
        moveBy = speed * (delta / 1000);
        velocityRef.current = 0;
      }
    }

    // Logika wrap yang selalu berjalan, sekarang menangani pergerakan inersia juga
    const newPos = x.get() + moveBy;
    const wrappedX = wrap(-trackWidth, 0, newPos);
    x.set(wrappedX);
  });

  return (
    <div className='slide-view-container'>
      <motion.div
        ref={trackRef}
        className='infinite-slider-track'
        onPanStart={() => {
          x.stop();
          setIsDragging(true);
          velocityRef.current = 0;
        }}
        onPan={(event, info) => {
          // PERBAIKAN 3: Terapkan faktor pengali pada pergerakan drag
          x.set(x.get() + info.delta.x * DRAG_FACTOR);
        }}
        onPanEnd={(event, info) => {
          setIsDragging(false);
          // Kecepatan akhir juga dikalikan dengan faktor yang sama untuk inersia yang konsisten
          velocityRef.current = info.velocity.x * DRAG_FACTOR;
        }}
        style={{ x }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
};
const GridItem = ({
  project,
  onClick,
  activeItemId,
  setActiveItemId,
  gridStyle,
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const isOverlayVisible = activeItemId === project.id;
  useEffect(() => {
    const checkDeviceType = () => {
      const touchCheck =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(touchCheck);
    };
    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);
  const handleMouseEnter = () => {
    if (!isTouchDevice) setActiveItemId(project.id);
  };
  const handleMouseLeave = () => {
    if (!isTouchDevice) setActiveItemId(null);
  };
  const handleTap = () => {
    if (isTouchDevice) setActiveItemId(isOverlayVisible ? null : project.id);
  };
  const handleViewClick = (e) => {
    e.stopPropagation();
    onClick(project);
  };
  const largeTileClass = React.useMemo(() => {
    if (gridStyle !== 'large-tile') return '';
    const idBasedRandom = ((project.id * 23 + 97) % 100) / 100;
    if (idBasedRandom < 0.7) return 'normal';
    if (idBasedRandom < 0.8) return 'wide';
    if (idBasedRandom < 0.9) return 'tall';
    return 'large';
  }, [gridStyle, project.id]);
  return (
    <motion.div
      layoutId={project.id}
      className={`grid-item ${
        isOverlayVisible ? 'overlay-active' : ''
      } ${largeTileClass}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}>
      {' '}
      <div className='project-image-container'>
        {' '}
        <motion.img
          src={project.imageUrl}
          alt={project.title}
          whileHover={!isTouchDevice ? { scale: 1.05 } : {}}
          transition={{ duration: 0.4 }}
          onContextMenu={(e) => e.preventDefault()} // Mencegah klik kanan
          onDragStart={(e) => e.preventDefault()} // Mencegah drag
          draggable='false' //mencegah drag di beberapa browser yang berbasis webkit (chrome, safari)
          style={{
            WebkitTouchCallout: 'none', // <- Properti Kunci img untuk iOS
            KhtmlUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none',
          }}
        />{' '}
      </div>{' '}
      <AnimatePresence>
        {' '}
        {isOverlayVisible && (
          <motion.div
            className='grid-item-overlay'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}>
            {' '}
            <div className='grid-overlay-left'>
              {' '}
              <h3>{project.title}</h3> <p>{project.category.join(' & ')}</p>{' '}
            </div>{' '}
            <div className='grid-overlay-right'>
              {' '}
              <p className='project-year'>{project.year}</p>{' '}
              <Magnetic>
                {' '}
                <div
                  className='view-project-button'
                  onClick={handleViewClick}>
                  {' '}
                  <Magnetic>
                    {' '}
                    <span>View</span>{' '}
                  </Magnetic>{' '}
                </div>{' '}
              </Magnetic>{' '}
            </div>{' '}
          </motion.div>
        )}{' '}
      </AnimatePresence>{' '}
    </motion.div>
  );
};
const CustomCursor = ({ cursorState, isHovering, isDragging }) => {
  const mouse = {
    x: useSpring(0, { damping: 25, stiffness: 300 }),
    y: useSpring(0, { damping: 25, stiffness: 300 }),
  };
  const scale = useSpring(0, { damping: 20, stiffness: 200 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.x.set(e.clientX);
      mouse.y.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouse.x, mouse.y]);
  useEffect(() => {
    scale.set(isHovering || isDragging ? 1 : 0);
  }, [isHovering, isDragging, scale]);
  let displayText = 'View';
  if (cursorState === 'slide-left') displayText = '← Slide';
  if (cursorState === 'slide-right') displayText = 'Slide →';
  return (
    <motion.div
      className='custom-cursor'
      style={{
        translateX: mouse.x,
        translateY: mouse.y,
        x: '-50%',
        y: '-50%',
        scale,
      }}>
      {' '}
      <AnimatePresence mode='wait'>
        {' '}
        <Magnetic>
          {' '}
          <motion.span
            key={displayText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}>
            {' '}
            {displayText}{' '}
          </motion.span>{' '}
        </Magnetic>{' '}
      </AnimatePresence>{' '}
    </motion.div>
  );
};
const DraggableToggle = ({ style, setStyle, options }) => {
  const containerRef = useRef(null);
  const [parentWidth, setParentWidth] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const PADDING = 3;
  const SNAP_THRESHOLD = 0.3;
  const x = useSpring(0, { stiffness: 700, damping: 25 });
  const scale = useSpring(1, { stiffness: 700, damping: 25 });
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
  const effectiveWidth = parentWidth > 0 ? parentWidth - PADDING * 2 : 0;
  const itemWidth = options.length > 0 ? effectiveWidth / options.length : 0;
  const activeIndex = options.indexOf(style);
  const targetX = PADDING + activeIndex * itemWidth;
  useEffect(() => {
    if (itemWidth > 0) {
      x.set(targetX);
    }
  }, [targetX, x, itemWidth]);
  const handleMouseMove = (e) => {
    if (!containerRef.current || itemWidth === 0) return;
    const { left } = containerRef.current.getBoundingClientRect();
    const hoverX = e.clientX - left;
    const index = Math.floor((hoverX - PADDING) / itemWidth);
    setHoveredIndex(index);
  };
  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  const handleContainerClick = (e) => {
    if (!containerRef.current || itemWidth === 0) return;
    scale.set(1.1);
    setTimeout(() => scale.set(1), 400);
    const { left } = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - left;
    const index = Math.floor((clickX - PADDING) / itemWidth);
    const validIndex = Math.max(0, Math.min(options.length - 1, index));
    setStyle(options[validIndex]);
  };
  const handleDragEnd = (event, info) => {
    if (itemWidth === 0) return;
    const startIndex = options.indexOf(style);
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
    newIndex = Math.max(0, Math.min(options.length - 1, newIndex));
    const newTargetX = PADDING + newIndex * itemWidth;
    x.stop();
    x.set(newTargetX);
    setStyle(options[newIndex]);
  };
  return (
    <motion.div
      className={`style-selector options-${options.length}`}
      ref={containerRef}
      onClick={handleContainerClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'pointer' }}>
      {' '}
      <motion.div
        className='active-bg'
        style={{ x, scale, width: itemWidth > 0 ? itemWidth : '100%' }}
        drag='x'
        dragConstraints={{
          left: PADDING,
          right: PADDING + (options.length - 1) * itemWidth,
        }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={() => scale.set(1.1)}
        onPointerUp={() => scale.set(1)}
      />{' '}
      {options.map((option, index) => {
        const displayText = option.charAt(0).toUpperCase() + option.slice(1);
        return (
          <div
            key={option}
            className={`style-btn ${
              hoveredIndex === index ? 'is-hovered' : ''
            }`}>
            {' '}
            <div
              className='slot-viewport'
              data-text={displayText}>
              {' '}
              <span className='slot-text'>{displayText}</span>{' '}
            </div>{' '}
          </div>
        );
      })}{' '}
    </motion.div>
  );
};

// --- MAIN PORTFOLIO COMPONENT ---
const Portfolio = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [slideStyle, setSlideStyle] = useState('default');
  const [gridStyle, setGridStyle] = useState('default');
  const [visualStyle, setVisualStyle] = useState('spaced');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isStickyFilterOpen, setIsStickyFilterOpen] = useState(false);
  const [isStickyViewOpen, setIsStickyViewOpen] = useState(false);
  const [activeGridItemId, setActiveGridItemId] = useState(null);
  const [recentCategory, setRecentCategory] = useState('learning');
  const [moreCategory, setMoreCategory] = useState(null);
  const [isHeaderViewDropdownOpen, setIsHeaderViewDropdownOpen] =
    useState(false);
  const [isAnySliderDragging, setIsAnySliderDragging] = useState(false);
  const [slideIndex1, setSlideIndex1] = useState(0);
  const [slideIndex2, setSlideIndex2] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  // PERBAIKAN: Menambahkan deklarasi yang hilang
  const viewModes = ['list', 'grid', 'slide'];

  const headerViewDropdownRef = useRef(null);
  const headerRef = useRef(null);
  const stickyFilterRef = useRef(null);
  const stickyViewRef = useRef(null);
  const dropdownRef = useRef(null);
  const gridSelectorRef = useRef(null);
  const slideSelectorRef = useRef(null);
  const visualSelectorRef = useRef(null);
  const stickyGridSelectorRef = useRef(null);
  const stickySlideSelectorRef = useRef(null);
  const stickyVisualSelectorRef = useRef(null);
  const mainContentRef = useRef(null);
  const mainContentWrapperRef = useRef(null);
  const GridWaveRef = useRef(null);
  const SlideWaveRef = useRef(null);
  const containerRef1 = useRef(null);
  const containerRef2 = useRef(null);
  const dragXMobile1 = useSpring(0, { stiffness: 300, damping: 40 });
  const dragXMobile2 = useSpring(0, { stiffness: 300, damping: 40 });

  const isMobile = useMediaQuery('(max-width: 900px)');
  const { scrollY } = useScroll();
  const [headerHeight, setHeaderHeight] = useState(0);
  const lastScrollY = useRef(0);
  const [scrollDirection, setScrollDirection] = useState('down');

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ['start start', 'end start'],
    layoutEffect: false,
  });
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const yButton = useTransform(scrollYProgress, [0, 1], ['0%', '-70%']);

  useEffect(() => {
    // Saat komponen Portfolio muncul, paksa <body> untuk
    // mematikan semua perilaku pantulan/overscroll.
    document.body.style.overscrollBehavior = 'none';

    // Saat komponen Portfolio hilang (pindah halaman),
    // kembalikan perilaku default browser.
    return () => {
      document.body.style.overscrollBehavior = 'auto';
    };
  }, []);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      // Your logic when scrollY changes (remains the same)
      if (latest > lastScrollY.current) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      lastScrollY.current = latest;
    });

    // Return the unsubscribe function for cleanup
    return unsubscribe;
  }, [scrollY]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    }, 100);
    const handleResize = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
      if (typeof window !== 'undefined') setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const transitionPoint = headerHeight > 0 ? headerHeight + 100 : 300;
  const stickyControlsOpacity = useTransform(
    scrollY,
    [transitionPoint - 50, transitionPoint],
    [0, 1]
  );
  const stickyControlsY = useTransform(
    scrollY,
    [transitionPoint - 50, transitionPoint],
    ['100%', '0%']
  );
  const stickyControlsPointerEvents = useTransform(
    scrollY,
    [transitionPoint - 25, transitionPoint],
    ['none', 'auto']
  );
  const topToggleOpacity = useTransform(
    scrollY,
    [transitionPoint - 100, transitionPoint - 50],
    [1, 0]
  );
  const topTogglePointerEvents = useTransform(
    scrollY,
    [transitionPoint - 75, transitionPoint - 25],
    ['auto', 'auto']
  );

  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));
  useOnClickOutside(stickyFilterRef, () => setIsStickyFilterOpen(false));
  useOnClickOutside(stickyViewRef, () => setIsStickyViewOpen(false));
  useOnClickOutside(headerViewDropdownRef, () =>
    setIsHeaderViewDropdownOpen(false)
  );

  const allFilterableCategories = [
    'design',
    'development',
    'learning',
    'experience',
    'achievements',
    'credentials',
  ];
  const allCategoriesForCount = ['all', ...allFilterableCategories];
  const categoryCounts = React.useMemo(() => {
    const counts = {};
    allCategoriesForCount.forEach((cat) => {
      counts[cat] = projectData.filter((p) =>
        cat === 'all' ? true : p.category.includes(cat)
      ).length;
    });
    return counts;
  }, []);
  const filteredProjects =
    filter === 'all'
      ? projectData
      : projectData.filter((p) => p.category.includes(filter));
  const middleIndex = Math.ceil(filteredProjects.length / 2);
  const projects1 = filteredProjects.slice(0, middleIndex);
  const projects2 = filteredProjects.slice(middleIndex);

  useEffect(() => {
    if (scrollY.get() > transitionPoint && mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [filter, scrollY, transitionPoint]);
  useEffect(() => {
    setSlideIndex1(0);
    setSlideIndex2(0);
  }, [filter]);
  useEffect(() => {
    animate(dragXMobile1, -slideIndex1 * windowWidth);
  }, [slideIndex1, windowWidth]); //dragXMobile1
  useEffect(() => {
    animate(dragXMobile2, -slideIndex2 * windowWidth);
  }, [slideIndex2, windowWidth, dragXMobile2]); //

  const holdTimerRef = useRef(null);
  const handleMouseEnterItem = (item) => {
    // JANGAN lakukan apa-apa jika ini perangkat mobile
    if (isMobile) return;
    !isAnySliderDragging && setHoveredItem(item);
  };
  // --- DAN FUNGSI INI ---
  const handleMouseLeaveItem = () => {
    // JANGAN lakukan apa-apa jika ini perangkat mobile
    if (isMobile) return;
    setHoveredItem(null);
  };
  // const handleMouseEnterItem = (item) =>
  //   !isAnySliderDragging && setHoveredItem(item);
  // const handleMouseLeaveItem = () => setHoveredItem(null);
  const handleTouchStart = (e, project) => {
    holdTimerRef.current = setTimeout(() => {
      setHoveredItem(project);
    }, 200);
  };
  const handleTouchMove = () => {
    clearTimeout(holdTimerRef.current);
  };
  const handleTouchEnd = () => {
    clearTimeout(holdTimerRef.current);
    setHoveredItem(null);
  };
  const handleGridItemClick = (project) => navigate(`/project/${project.id}`);
  const handleClick = () => {
    if (viewMode === 'slide' && !isAnySliderDragging && hoveredItem)
      navigate(`/project/${hoveredItem.id}`);
  };
  const handleMobileDragEnd = (info, projects, currentIndex, setIndex) => {
    const swipePower = Math.abs(info.offset.x) * info.velocity.x;
    if (swipePower < -10000) {
      setIndex(Math.min(currentIndex + 1, projects.length - 1));
    } else if (swipePower > 10000) {
      setIndex(Math.max(currentIndex - 1, 0));
    }
  };
  const stickyDropdownMenuVariants = {
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
        staggerDirection: -1,
      },
    },
    closed: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: 'afterChildren',
      },
    },
  };
  const stickyDropdownItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { y: { stiffness: 1000, velocity: -100 } },
    },
    closed: { y: 20, opacity: 0, transition: { y: { stiffness: 1000 } } },
  };
  const HeaderDropdownMenuVariants = {
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
        staggerDirection: 1,
      },
    },
    closed: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: 1,
        when: 'afterChildren',
      },
    },
  };
  const headerDropdownItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { y: { stiffness: 1000, velocity: -100 } },
    },
    closed: { y: -20, opacity: 0, transition: { y: { stiffness: 1000 } } },
  };
  const renderIcon = (mode) => {
    if (mode === 'list')
      return (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'>
          {' '}
          <line
            x1='4'
            y1='6'
            x2='21'
            y2='6'></line>{' '}
          <line
            x1='8'
            y1='12'
            x2='21'
            y2='12'></line>{' '}
          <line
            x1='4'
            y1='18'
            x2='21'
            y2='18'></line>{' '}
          <line
            x1='3'
            y1='6'
            x2='3.01'
            y2='6'></line>{' '}
          <line
            x1='3'
            y1='12'
            x2='3.01'
            y2='12'></line>{' '}
          <line
            x1='3'
            y1='18'
            x2='3.01'
            y2='18'></line>{' '}
        </svg>
      );
    if (mode === 'grid')
      return (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'>
          {' '}
          <rect
            x='3'
            y='3'
            width='7'
            height='7'></rect>{' '}
          <rect
            x='14'
            y='3'
            width='7'
            height='7'></rect>{' '}
          <rect
            x='14'
            y='14'
            width='7'
            height='7'></rect>{' '}
          <rect
            x='3'
            y='14'
            width='7'
            height='7'></rect>{' '}
        </svg>
      );
    if (mode === 'slide')
      return (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'>
          {' '}
          <rect
            x='2'
            y='6'
            width='9'
            height='12'
            rx='2'
            ry='2'></rect>{' '}
          <rect
            x='13'
            y='4'
            width='9'
            height='16'
            rx='2'
            ry='2'></rect>{' '}
        </svg>
      );
    return null;
  };
  const moreButtonText = moreCategory
    ? moreCategory.charAt(0).toUpperCase() + moreCategory.slice(1)
    : 'More';
  const dropdownCategories = allFilterableCategories.filter(
    (cat) => cat !== recentCategory && cat !== moreCategory
  );
  const stickyDropdownCategories = allCategoriesForCount.filter(
    (cat) => cat !== filter
  );

  return (
    <motion.div
      variants={variants}
      initial='closed'
      animate='open'
      className={`portfolio-container ${
        viewMode === 'slide' ? 'slide-mode-active' : ''
      } ${viewMode === 'list' ? 'list-mode-active' : ''}`}>
      {viewMode === 'slide' && !isMobile && (
        <CustomCursor
          isHovering={!!hoveredItem}
          isDragging={isAnySliderDragging}
        />
      )}
      {viewMode === 'list' && <TeaserImage hoveredProject={hoveredItem} />}
      <motion.header
        ref={headerRef}
        className='portfolio-header'
        variants={itemVariants}>
        <motion.div style={{ y: yText }}>
          {' '}
          <motion.h1>
            Doing <span>what I love,</span> beautifully.
          </motion.h1>{' '}
        </motion.div>
        <motion.div
          className='controls-wrapper'
          style={{ y: yButton }}>
          <motion.div className='filter-buttons'>
            <Magnetic>
              {' '}
              <ButtonReveal
                as='button'
                whileTap={{ scale: '0.85' }}
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => {
                  if (filter === 'all') return;
                  if (moreCategory) {
                    setRecentCategory(moreCategory);
                  }
                  setMoreCategory(null);
                  setFilter('all');
                }}>
                {' '}
                <div className='text-anim-wrapper'>
                  {' '}
                  <AnimatePresence mode='wait'>
                    {' '}
                    <motion.div
                      key='all-text'
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      {' '}
                      <SlotText>All</SlotText>{' '}
                    </motion.div>{' '}
                  </AnimatePresence>{' '}
                </div>{' '}
                <div className='sup-container'>
                  {' '}
                  <AnimatePresence mode='wait'>
                    {' '}
                    <motion.sup
                      key={categoryCounts['all']}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}>
                      {' '}
                      {categoryCounts['all']}{' '}
                    </motion.sup>{' '}
                  </AnimatePresence>{' '}
                </div>{' '}
              </ButtonReveal>{' '}
            </Magnetic>
            <Magnetic>
              {' '}
              <ButtonReveal
                as='button'
                whileTap={{ scale: '0.85' }}
                className={`filter-btn ${
                  filter === recentCategory ? 'active' : ''
                }`}
                onClick={() => {
                  if (filter === recentCategory) return;
                  setFilter(recentCategory);
                }}>
                {' '}
                <div className='text-anim-wrapper'>
                  {' '}
                  <AnimatePresence mode='wait'>
                    {' '}
                    <motion.div
                      key={recentCategory}
                      initial={{ y: 15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      {' '}
                      <SlotText>
                        {' '}
                        {recentCategory.charAt(0).toUpperCase() +
                          recentCategory.slice(1)}{' '}
                      </SlotText>{' '}
                    </motion.div>{' '}
                  </AnimatePresence>{' '}
                </div>{' '}
                <div className='sup-container'>
                  {' '}
                  <AnimatePresence mode='wait'>
                    {' '}
                    <motion.sup
                      key={`${recentCategory}-${categoryCounts[recentCategory]}`}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}>
                      {' '}
                      {categoryCounts[recentCategory]}{' '}
                    </motion.sup>{' '}
                  </AnimatePresence>{' '}
                </div>{' '}
              </ButtonReveal>{' '}
            </Magnetic>
            <div
              className='dropdown-container'
              ref={dropdownRef}>
              <Magnetic>
                {' '}
                <ButtonReveal
                  as='button'
                  whileTap={{ scale: '0.85' }}
                  className={`filter-btn dropdown-toggle ${
                    filter === moreCategory ? 'active' : ''
                  }`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  {' '}
                  <div className='text-anim-wrapper'>
                    {' '}
                    <AnimatePresence mode='wait'>
                      {' '}
                      <motion.div
                        key={moreButtonText}
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -15, opacity: 0 }}
                        transition={{ duration: 0.2 }}>
                        {' '}
                        <SlotText>{moreButtonText}</SlotText>{' '}
                      </motion.div>{' '}
                    </AnimatePresence>{' '}
                  </div>{' '}
                  {filter === moreCategory && (
                    <div className='sup-container'>
                      {' '}
                      <AnimatePresence mode='wait'>
                        {' '}
                        <motion.sup
                          key={categoryCounts[filter]}
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 10, opacity: 0 }}>
                          {' '}
                          {categoryCounts[filter]}{' '}
                        </motion.sup>{' '}
                      </AnimatePresence>{' '}
                    </div>
                  )}{' '}
                  <AnimatedArrowIcon isOpen={isDropdownOpen} />{' '}
                </ButtonReveal>{' '}
              </Magnetic>
              <AnimatePresence>
                {' '}
                {isDropdownOpen && (
                  <motion.div
                    className='dropdown-menu'
                    variants={HeaderDropdownMenuVariants}
                    initial='closed'
                    animate='open'
                    exit='closed'>
                    {' '}
                    {dropdownCategories.map((cat) => (
                      <motion.div
                        key={cat}
                        variants={headerDropdownItemVariants}>
                        {' '}
                        <button
                          className={`dropdown-item`}
                          onClick={() => {
                            if (moreCategory) {
                              setRecentCategory(moreCategory);
                            }
                            setMoreCategory(cat);
                            setFilter(cat);
                            setIsDropdownOpen(false);
                          }}>
                          {' '}
                          <SlotText>
                            {' '}
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}{' '}
                          </SlotText>{' '}
                          <AnimatePresence mode='wait'>
                            {' '}
                            <motion.sup
                              key={categoryCounts[cat]}
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: 10, opacity: 0 }}>
                              {' '}
                              {categoryCounts[cat]}{' '}
                            </motion.sup>{' '}
                          </AnimatePresence>{' '}
                        </button>{' '}
                      </motion.div>
                    ))}{' '}
                  </motion.div>
                )}{' '}
              </AnimatePresence>
            </div>
          </motion.div>
          <div className='view-switcher'>
            {isMobile ? (
              <div
                className='sticky-dropdown-container header-dropdown'
                ref={headerViewDropdownRef}>
                {' '}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className='view-dropdown-toggle icon-btn'
                  onClick={() =>
                    setIsHeaderViewDropdownOpen(!isHeaderViewDropdownOpen)
                  }>
                  {' '}
                  {renderIcon(viewMode)}{' '}
                  <AnimatedArrowIcon isOpen={isHeaderViewDropdownOpen} />{' '}
                </motion.button>{' '}
                <AnimatePresence>
                  {' '}
                  {isHeaderViewDropdownOpen && (
                    <motion.div
                      className='dropdown-menu'
                      variants={HeaderDropdownMenuVariants}
                      initial='closed'
                      animate='open'
                      exit='closed'>
                      {' '}
                      {viewModes.map((mode) => (
                        <motion.div
                          key={mode}
                          variants={headerDropdownItemVariants}>
                          {' '}
                          <button
                            className={`sticky-dropdown-item`}
                            onClick={() => {
                              setViewMode(mode);
                              setIsHeaderViewDropdownOpen(false);
                            }}>
                            {' '}
                            {renderIcon(mode)}{' '}
                            <SlotText>
                              {' '}
                              {mode.charAt(0).toUpperCase() +
                                mode.slice(1)}{' '}
                            </SlotText>{' '}
                          </button>{' '}
                        </motion.div>
                      ))}{' '}
                    </motion.div>
                  )}{' '}
                </AnimatePresence>{' '}
              </div>
            ) : (
              viewModes.map((mode) => (
                <Magnetic key={mode}>
                  {' '}
                  <ButtonReveal
                    as='button'
                    whileTap={{ scale: '0.85' }}
                    className={`view-btn ${viewMode === mode ? 'active' : ''}`}
                    onClick={() => setViewMode(mode)}>
                    {' '}
                    <Magnetic>{renderIcon(mode)}</Magnetic>{' '}
                  </ButtonReveal>{' '}
                </Magnetic>
              ))
            )}
          </div>
        </motion.div>
      </motion.header>
      <motion.main
        ref={mainContentRef}
        className='content-area'
        variants={itemVariants}
        onClick={handleClick}>
        <motion.div
          className='style-toggle-container'
          style={{
            opacity: topToggleOpacity,
            pointerEvents: topTogglePointerEvents,
          }}>
          <div
            className='style-toggle-placer'
            variants={itemVariants}>
            <AnimatePresence mode='wait'>
              {viewMode === 'grid' && (
                <motion.div
                  className='toggles-group'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}>
                  {' '}
                  <DraggableToggle
                    key='grid-layout-toggle'
                    style={gridStyle}
                    setStyle={setGridStyle}
                    options={['default', 'large-tile', 'compact']}
                    parentRef={gridSelectorRef}
                  />{' '}
                  <DraggableToggle
                    key='grid-visual-toggle'
                    style={visualStyle}
                    setStyle={setVisualStyle}
                    options={['spaced', 'seamless']}
                    parentRef={visualSelectorRef}
                  />{' '}
                </motion.div>
              )}
              {viewMode === 'slide' && (
                <DraggableToggle
                  key='slide-toggle'
                  style={slideStyle}
                  setStyle={setSlideStyle}
                  options={['default', 'compact']}
                  parentRef={slideSelectorRef}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        <div
          className='main-content-wrapper'
          variants={itemVariants}
          style={{ zIndex: '5' }}>
          <AnimatePresence mode='wait'>
            {viewMode === 'list' && (
              <motion.div
                key='list'
                variants={itemVariants}
                className='list-view-wrapper'>
                {' '}
                <div
                  className='list-view-portfolio'
                  style={{ zIndex: '9999' }}>
                  {' '}
                  {filteredProjects.map((project, index) => (
                    <ListItem
                      key={project.id}
                      project={project}
                      index={index}
                      onMouseEnter={handleMouseEnterItem}
                      onMouseLeave={handleMouseLeaveItem}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onClick={handleGridItemClick}
                      isHovered={hoveredItem?.id === project.id}
                      scrollDirection={scrollDirection}
                    />
                  ))}{' '}
                </div>{' '}
                <div
                  className='ListWaveContainer'
                  style={{ zIndex: '3' }}>
                  {' '}
                  <div
                    className='ListWaveHelper'
                    ref={mainContentWrapperRef}
                    style={{ zIndex: '3' }}>
                    <Wave
                      config={listWaveConfig}
                      colors={['#fff7ed', '#fff7ed']}
                      targetRef={mainContentWrapperRef}
                    />{' '}
                  </div>{' '}
                  <div style={{ zIndex: '1' }}> </div>{' '}
                </div>{' '}
              </motion.div>
            )}
            {viewMode === 'grid' && (
              <motion.div
                key='grid'
                variants={itemVariants}>
                {' '}
                <LayoutGroup>
                  {' '}
                  <motion.div
                    className={`grid-view ${gridStyle}-style ${visualStyle}-style`}>
                    {' '}
                    {filteredProjects.map((project) => (
                      <GridItem
                        key={project.id}
                        project={project}
                        onClick={handleGridItemClick}
                        activeItemId={activeGridItemId}
                        setActiveItemId={setActiveGridItemId}
                        gridStyle={gridStyle}
                      />
                    ))}{' '}
                  </motion.div>{' '}
                  <div
                    className='GridWaveContainer'
                    style={{ zIndex: '2' }}>
                    <div
                      className='GridWaveHelper'
                      ref={GridWaveRef}
                      style={{ zIndex: '1' }}>
                      <Wave
                        config={GridWaveConfig}
                        colors={['#fff7ed', '#fff7ed']}
                        targetRef={GridWaveRef}
                      />{' '}
                    </div>{' '}
                  </div>{' '}
                </LayoutGroup>{' '}
              </motion.div>
            )}
            {viewMode === 'slide' && (
              <motion.div
                key='slide'
                className={`slide-view-wrapper ${slideStyle}-style`}
                variants={itemVariants}>
                {' '}
                {isMobile && slideStyle === 'compact' ? (
                  <>
                    {' '}
                    <div className='mobile-slider-container'>
                      {' '}
                      <motion.div
                        className='slide-view-container'
                        ref={containerRef1}>
                        {' '}
                        <motion.div
                          className='projects-container-horizontal'
                          drag='x'
                          style={{ x: dragXMobile1 }}
                          dragConstraints={{
                            right: 0,
                            left: -(projects1.length - 1) * windowWidth,
                          }}
                          onDragEnd={(e, info) =>
                            handleMobileDragEnd(
                              info,
                              projects1,
                              slideIndex1,
                              setSlideIndex1
                            )
                          }>
                          {' '}
                          {projects1.map((project) => (
                            <motion.div
                              key={project.id}
                              className='project-item-horizontal'>
                              {' '}
                              <div className='image-container'>
                                {' '}
                                <img
                                  src={project.imageUrl}
                                  alt={project.title}
                                  // draggable='false'
                                />{' '}
                              </div>{' '}
                              <div className='slide-item-info'>
                                {' '}
                                <h3>{project.title}</h3>{' '}
                                <p className='list-item-category'>
                                  {' '}
                                  {project.category.join(' & ')}{' '}
                                </p>{' '}
                              </div>{' '}
                              <span className='slide-item-year'>
                                {' '}
                                {project.year}{' '}
                              </span>{' '}
                            </motion.div>
                          ))}{' '}
                        </motion.div>{' '}
                      </motion.div>{' '}
                      <div className='dots-indicator'>
                        {' '}
                        {projects1.map((_, i) => (
                          <div
                            key={i}
                            className={`dot ${
                              i === slideIndex1 ? 'active' : ''
                            }`}
                            onClick={() => setSlideIndex1(i)}
                          />
                        ))}{' '}
                      </div>{' '}
                    </div>{' '}
                    <div className='mobile-slider-container'>
                      {' '}
                      <motion.div
                        className='slide-view-container'
                        ref={containerRef2}>
                        {' '}
                        <motion.div
                          className='projects-container-horizontal'
                          drag='x'
                          style={{ x: dragXMobile2 }}
                          dragConstraints={{
                            right: 0,
                            left: -(projects2.length - 1) * windowWidth,
                          }}
                          onDragEnd={(e, info) =>
                            handleMobileDragEnd(
                              info,
                              projects2,
                              slideIndex2,
                              setSlideIndex2
                            )
                          }>
                          {' '}
                          {projects2.map((project) => (
                            <motion.div
                              key={project.id}
                              className='project-item-horizontal'>
                              {' '}
                              <div className='image-container'>
                                {' '}
                                <img
                                  src={project.imageUrl}
                                  alt={project.title}
                                  // draggable='false'
                                />{' '}
                              </div>{' '}
                              <div className='slide-item-info'>
                                {' '}
                                <h3>{project.title}</h3>{' '}
                                <p className='list-item-category'>
                                  {' '}
                                  {project.category.join(' & ')}{' '}
                                </p>{' '}
                              </div>{' '}
                              <span className='slide-item-year'>
                                {' '}
                                {project.year}{' '}
                              </span>{' '}
                            </motion.div>
                          ))}{' '}
                        </motion.div>{' '}
                      </motion.div>{' '}
                      <div className='dots-indicator'>
                        {' '}
                        {projects2.map((_, i) => (
                          <div
                            key={i}
                            className={`dot ${
                              i === slideIndex2 ? 'active' : ''
                            }`}
                            onClick={() => setSlideIndex2(i)}
                          />
                        ))}{' '}
                      </div>{' '}
                    </div>{' '}
                  </>
                ) : (
                  <>
                    {' '}
                    <InteractiveSlider
                      scrollDirection={scrollDirection}
                      onDragStateChange={setIsAnySliderDragging}>
                      {' '}
                      {projects1.map((project) => (
                        <motion.div
                          layout
                          key={project.id}
                          className='project-item-horizontal'
                          onMouseEnter={() => handleMouseEnterItem(project)}
                          onMouseLeave={handleMouseLeaveItem}>
                          {' '}
                          <div className='image-container'>
                            {' '}
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              // draggable='false'
                            />{' '}
                          </div>{' '}
                          <div className='slide-item-info'>
                            {' '}
                            <h3>{project.title}</h3>{' '}
                            <p className='list-item-category'>
                              {' '}
                              {project.category.join(' & ')}{' '}
                            </p>{' '}
                          </div>{' '}
                          <span className='slide-item-year'>
                            {' '}
                            {project.year}{' '}
                          </span>{' '}
                        </motion.div>
                      ))}{' '}
                    </InteractiveSlider>{' '}
                    <InteractiveSlider
                      scrollDirection={
                        scrollDirection === 'down' ? 'up' : 'down'
                      }
                      onDragStateChange={setIsAnySliderDragging}>
                      {' '}
                      {projects2.map((project) => (
                        <motion.div
                          layout
                          key={project.id}
                          className='project-item-horizontal'
                          onMouseEnter={() => handleMouseEnterItem(project)}
                          onMouseLeave={handleMouseLeaveItem}>
                          {' '}
                          <div className='image-container'>
                            {' '}
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              // draggable='false'
                            />{' '}
                          </div>{' '}
                          <div className='slide-item-info'>
                            {' '}
                            <h3>{project.title}</h3>{' '}
                            <p className='list-item-category'>
                              {' '}
                              {project.category.join(' & ')}{' '}
                            </p>{' '}
                          </div>{' '}
                          <span className='slide-item-year'>
                            {' '}
                            {project.year}{' '}
                          </span>{' '}
                        </motion.div>
                      ))}{' '}
                    </InteractiveSlider>{' '}
                  </>
                )}{' '}
                <div className='marquee-text-container'>
                  {' '}
                  <InteractiveSlider
                    scrollDirection={scrollDirection}
                    onDragStateChange={() => {}}
                    baseVelocity={80}>
                    {' '}
                    <p className='marquee-text'>{marqueeText}</p>{' '}
                  </InteractiveSlider>{' '}
                </div>{' '}
                <div
                  className='SlideWaveContainer'
                  style={{ zIndex: '1' }}>
                  {' '}
                  <div
                    className='SlideWaveHelper'
                    ref={SlideWaveRef}
                    style={{ zIndex: '1' }}>
                    {' '}
                    <Wave
                      config={SlideWaveConfig}
                      colors={['#fff7ed', '#fff7ed']}
                      targetRef={SlideWaveRef}
                    />{' '}
                  </div>{' '}
                </div>{' '}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
      <motion.div
        className={`sticky-controls-header ${
          viewMode === 'list' ? 'list-mode-sticky' : ''
        }`}
        style={{
          opacity: stickyControlsOpacity,
          y: stickyControlsY,
          pointerEvents: stickyControlsPointerEvents,
        }}>
        <div
          className='sticky-dropdown-container'
          ref={stickyFilterRef}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className='sticky-dropdown-toggle'
            onClick={() => setIsStickyFilterOpen(!isStickyFilterOpen)}>
            <div className='toggle-label-group'>
              <div className='text-anim-wrapper'>
                {' '}
                <AnimatePresence mode='wait'>
                  {' '}
                  <motion.div
                    key={filter}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.2 }}>
                    {' '}
                    <SlotText>
                      {' '}
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}{' '}
                    </SlotText>{' '}
                  </motion.div>{' '}
                </AnimatePresence>{' '}
              </div>
              <div className='sup-container'>
                {' '}
                <AnimatePresence mode='wait'>
                  {' '}
                  <motion.sup
                    key={categoryCounts[filter]}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}>
                    {' '}
                    {categoryCounts[filter]}{' '}
                  </motion.sup>{' '}
                </AnimatePresence>{' '}
              </div>
            </div>
            <AnimatedArrowIcon isOpen={isStickyFilterOpen} />
          </motion.button>
          <AnimatePresence>
            {' '}
            {isStickyFilterOpen && (
              <motion.div
                className='sticky-dropdown-menu left'
                variants={stickyDropdownMenuVariants}
                initial='closed'
                animate='open'
                exit='closed'>
                {' '}
                {stickyDropdownCategories.map((cat) => (
                  <motion.div
                    key={cat}
                    variants={stickyDropdownItemVariants}>
                    {' '}
                    <button
                      className={`sticky-dropdown-item has-sup`}
                      onClick={() => {
                        setFilter(cat);
                        setIsStickyFilterOpen(false);
                      }}>
                      {' '}
                      <SlotText>
                        {' '}
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}{' '}
                      </SlotText>{' '}
                      <AnimatePresence mode='wait'>
                        {' '}
                        <motion.sup
                          key={categoryCounts[cat]}
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 10, opacity: 0 }}>
                          {' '}
                          {categoryCounts[cat] || 0}{' '}
                        </motion.sup>{' '}
                      </AnimatePresence>{' '}
                    </button>{' '}
                  </motion.div>
                ))}{' '}
              </motion.div>
            )}{' '}
          </AnimatePresence>
        </div>
        <div className='sticky-style-toggle-wrapper'>
          <AnimatePresence mode='wait'>
            {viewMode === 'grid' && (
              <motion.div
                className='toggles-group sticky-toggles'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                {' '}
                <DraggableToggle
                  key='grid-layout-toggle-sticky'
                  style={gridStyle}
                  setStyle={setGridStyle}
                  options={['default', 'large-tile', 'compact']}
                  parentRef={stickyGridSelectorRef}
                />{' '}
                <DraggableToggle
                  key='grid-visual-toggle-sticky'
                  style={visualStyle}
                  setStyle={setVisualStyle}
                  options={['spaced', 'seamless']}
                  parentRef={stickyVisualSelectorRef}
                />{' '}
              </motion.div>
            )}
            {viewMode === 'slide' && (
              <DraggableToggle
                key='slide-toggle-sticky'
                style={slideStyle}
                setStyle={setSlideStyle}
                options={['default', 'compact']}
                parentRef={stickySlideSelectorRef}
              />
            )}
          </AnimatePresence>
        </div>
        <div
          className='sticky-dropdown-container'
          ref={stickyViewRef}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className='sticky-dropdown-toggle icon-btn'
            onClick={() => setIsStickyViewOpen(!isStickyViewOpen)}>
            {' '}
            {renderIcon(viewMode)}{' '}
            <AnimatedArrowIcon isOpen={isStickyViewOpen} />{' '}
          </motion.button>
          <AnimatePresence>
            {' '}
            {isStickyViewOpen && (
              <motion.div
                className='sticky-dropdown-menu right'
                variants={stickyDropdownMenuVariants}
                initial='closed'
                animate='open'
                exit='closed'>
                {' '}
                {viewModes.map((mode) => (
                  <motion.div
                    key={mode}
                    variants={stickyDropdownItemVariants}>
                    {' '}
                    <button
                      className={`sticky-dropdown-item`}
                      onClick={() => {
                        setViewMode(mode);
                        setIsStickyViewOpen(false);
                      }}>
                      {' '}
                      {renderIcon(mode)}{' '}
                      <SlotText>
                        {' '}
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}{' '}
                      </SlotText>{' '}
                    </button>{' '}
                  </motion.div>
                ))}{' '}
              </motion.div>
            )}{' '}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Portfolio;
