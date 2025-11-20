import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import Hero from '../components/hero/Hero';
import Footer from '../components/hero/footer/Footer';
import PageTransition from './PageTransition';
import DateBubble from '../components/DateBubble/DateBubble';
import './pages.scss';
import useResponsiveBubble from '../components/DateBubble/UseResponsiveBubble';
import ContactSection from '.././components/ContactSection/ContactSection';
import Activity from '../components/aboutSection/Activity';

export default function Homepage({ navState }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  const containerRef = useRef(null);
  const { position, motionConfig } = useResponsiveBubble();

  return (
    <PageTransition label='Homepage'>
      <div
        className='pageWrapper'
        ref={ref}>
        <div className='contentLayer'>
          <Hero navState={navState} />
        </div>
        <div>
          <Activity />
        </div>

        <div className='dateBubbleLayer'>
          <DateBubble
            scrollYProgress={scrollYProgress}
            mode='default'
            position={position}
            motionConfig={motionConfig}
          />
        </div>

        <div className='footerLayer'>
          <ContactSection />
          <Footer />
        </div>
      </div>
    </PageTransition>
  );
}
