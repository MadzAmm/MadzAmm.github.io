import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import './PageTransition.scss';

export default function PageTransition({ label = '', children }) {
  const [phase, setPhase] = useState('enter');
  const [showContent, setShowContent] = useState(false);
  const [typedLabel, setTypedLabel] = useState('');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('hold'), 800),
      setTimeout(() => setPhase('exit'), 1600),
      setTimeout(() => setShowContent(true), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== 'hold' || !label || typeof label !== 'string') return;

    setTypedLabel('');
    let index = 0;

    const typing = setInterval(() => {
      const nextChar = label.charAt(index);
      setTypedLabel((prev) => prev + nextChar);
      index++;

      if (index >= label.length) {
        clearInterval(typing);
      }
    }, 85);

    return () => clearInterval(typing);
  }, [phase, label]);

  const variants = {
    enter: {
      clipPath: 'circle(500px at 50% 200%)',
      //   scale: 0.95,
      filter: 'blur(0px)',
      opacity: 1,
      transition: {
        stiffness: 100,
        type: 'spring',
        damping: 4,
      },
    },
    hold: {
      clipPath: 'circle(3000px at 100% 100%)',
      //   scale: 1,
      filter: 'blur(0px)',
      opacity: 1,
      transition: { stiffness: 20, type: 'spring' },
    },
    exit: {
      clipPath: 'circle(1000px at 50% -200%)',

      // scale: 0.95,
      filter: 'blur(0px)',
      opacity: 1,
      transition: {
        stiffness: 25,
        type: 'spring',
      },
    },
  };

  return (
    <>
      <AnimatePresence>
        {phase !== 'done' && (
          <motion.div
            className='page-transition'
            variants={variants}
            initial='enter'
            animate={phase}
            exit='exit'>
            <motion.div className='page-label'>{typedLabel}</motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showContent && (
        <motion.div
          className='page-content'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}>
          {children}
        </motion.div>
      )}
    </>
  );
}
