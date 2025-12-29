import { useScroll } from 'framer-motion';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from './PageTransition';
import DateBubble from '../components/DateBubble/DateBubble';
import Portfolio from '../components/Portfolio/Portfolio';
import ContactSection from '../components/ContactSection/ContactSection';

import Footer from '../components/hero/footer/Footer';
import useResponsiveBubble from '../components/DateBubble/UseResponsiveBubble';
import './pages.scss';

export default function PortfolioPage() {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const { position, motionConfig } = useResponsiveBubble('portfolio');

  const landingPageWaveConfig = {
    initialY: { desktop: 3100, tablet: -50, mobile: 0 },
    finalY: { desktop: -1820, tablet: -220, mobile: -150 },
    topWave: {
      wavePreset: { desktop: 'energetic', tablet: 'default', mobile: 'calm' },
      controlPoints: {
        desktop: [0, 0, 0, 0, 0, 0],
        tablet: [100, 150, 50, 150, 100],
        mobile: [100, 130, 100],
      },
    },
    bottomWave: {
      wavePreset: { desktop: 'calm', tablet: 'calm', mobile: 'calm' },
      controlPoints: {
        desktop: [800, 800, 420],
        tablet: [190, 210, 190],
        mobile: [180, 210, 180],
      },
    },
    springConfig: { stiffness: 10000, damping: 100 },
  };

  return (
    <PageTransition label='Portfolio'>
      <div
        className='pageWrapper'
        ref={ref}
        style={{ position: 'relative' }}>
        <main
          style={{
            zIndex: '3',
            position: 'relative',
          }}>
          <Portfolio />
        </main>
        <div></div>

        <footer
          style={{
            zIndex: '1',
            position: 'relative',
            backgroundColor: '#fff7ed',
          }}>
          <ContactSection style={{ zIndex: '1' }} />
          <Footer />
        </footer>

        <DateBubble
          mode='custom'
          scrollYProgress={scrollYProgress}
          navigate={navigate} //atur navigate di customStages dibawah
          position={position} //atur di UseResponsive
          motionConfig={motionConfig} //atur di UseResponsive
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
      </div>
    </PageTransition>
  );
}
