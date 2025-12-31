import { useScroll } from 'framer-motion';
import { useRef, React, useState, useEffect } from 'react';
import PageTransition from './PageTransition';
import DateBubble from '../components/DateBubble/DateBubble';
import LiquidGlass from '../components/LiquidGlass/LiquidGlass';
import ProjectPage from '../components/project/ProjectPage';
import { useNavigate, useParams } from 'react-router-dom'; // Pastikan ada useParams
import useResponsiveBubble from '../components/DateBubble/UseResponsiveBubble';
import './pages.scss';

/**
 * Hook kustom untuk mengecek media query secara dinamis.
 */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      mediaQueryList.addListener(handleChange);
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

export default function ServicesPage() {
  const navigate = useNavigate();
  // 1. Ambil ID dari URL untuk mengecek apakah user sedang membuka project
  const { projectId } = useParams();

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });
  const { position, motionConfig } = useResponsiveBubble('project');

  const pageWrapperRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <PageTransition label='Project'>
      <div
        className='pageWrapper'
        ref={pageWrapperRef}>
        {/* --- KOMPONEN BUBBLE (SELALU MUNCUL) --- */}
        <DateBubble
          mode='custom'
          scrollYProgress={scrollYProgress}
          navigate={navigate}
          position={position}
          motionConfig={motionConfig}
          customStages={[
            {
              range: [0, 0.1],
              text: 'About',
              bg: '#002f45',
              baseBg: '#ff4d4d',
              color: '#fff',
              onClick: () => navigate('/about'),
              isHoverable: true,
            },
            {
              range: [0.1, 0.2],
              text: 'Home',
              bg: '#ff4d4d',
              baseBg: '#002f45',
              color: '#fff',
              onClick: () => navigate('/'),
              isHoverable: true,
            },
            {
              range: [0.2, 0.8],
              text: 'Home',
              bg: 'rgba(0, 0, 0, 0.3)',
              color: '#fff',
              isHoverable: false,
            },
            {
              range: [0.9, 0.95],
              text: 'Tap to top',
              baseBg: '#ff4d4d',
              bg: 'rgba(0, 0, 0, 0.3)',
              color: '#fff',
              onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
              isHoverable: true,
            },
            {
              range: [0.9, 1],
              text: 'Get in touch',
              baseBg: '#002f45',
              bg: 'rgba(0, 0, 0, 0.3)',
              color: '#fff',
              onClick: () => navigate('/contact'),
              isHoverable: true,
            },
          ]}
        />

        {/* --- KOMPONEN LIQUID GLASS (SELALU MUNCUL DI DESKTOP) --- */}
        {!isMobile && (
          <LiquidGlass
            mouseContainer={pageWrapperRef}
            elasticity={0.5}
            mode={'prominent'}
            displacementScale={20}
            blurAmount={0}
            saturation={100}
            aberrationIntensity={10}
            cornerRadius={50}
            overLight={false}
            onClick={() => navigate('/Portfolio')}
            style={{
              position: 'fixed',
              boxSizing: 'border-box',
              bottom: '0',
              left: '50%',
              top: '80%',
              zIndex: 10,
            }}>
            <div
              className='p-6'
              style={{ textAlign: 'center' }}>
              <h1
                style={{
                  fontSize: 'clamp(0.6rem, 1rem + 4vw, 2.6rem)',
                }}>
                All Project
              </h1>
              <p
                style={{
                  fontSize: 'clamp(0.8rem, 0.7rem + 2vw, 1rem)',
                  maxWidth: '400px',
                }}>
                Driving growth and engagement through data-driven strategies.
              </p>
            </div>
          </LiquidGlass>
        )}

        {/* --- KOMPONEN PROJECT PAGE (MUNCUL BERSAMAAN JIKA ADA ID) ---
            Kita bungkus dengan DIV khusus untuk menghilangkan "Space Kosong".
            Teknik ini (Breakout) memaksa elemen selebar layar meskipun induknya punya padding.
        */}
        {projectId && (
          <div
            style={{
              width: '100vw', // Lebar layar penuh
              position: 'relative',
              left: '50%',
              right: '50%',
              marginLeft: '-50vw', // Tarik ke kiri mentok
              marginRight: '-50vw', // Tarik ke kanan mentok
              zIndex: 1, // Pastikan di bawah Bubble (Bubble biasanya z-index tinggi)
              marginTop: '5vh', // Beri sedikit jarak dari atas jika perlu
            }}>
            <ProjectPage />
          </div>
        )}
      </div>
    </PageTransition>
  );
}
