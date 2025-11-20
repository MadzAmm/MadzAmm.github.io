import { motion, useAnimationControls } from 'framer-motion';

export const ButtonReveal = ({
  as = 'div', // Render sebagai <div> secara default
  children,
  className,
  ...rest // Menerima props lain seperti href, onClick, dll.
}) => {
  const controls = useAnimationControls();
  const MotionComponent = motion[as]; // Komponen motion yang dinamis (motion.div, motion.a, dll)

  // Varian untuk animasi latar belakang
  const backgroundVariants = {
    // Fase A: Lingkaran di luar, sebelah kiri (tidak terlihat)
    initial: {
      clipPath: 'circle(50% at -50% 50%)',
    },
    // Fase B: Lingkaran memenuhi tombol saat di-hover
    hover: {
      clipPath: 'circle(100% at 50% 50%)',
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
    // Fase C: Lingkaran keluar ke kanan saat hover diangkat
    exit: {
      clipPath: 'circle(50% at 150% 50%)',
      transition: { duration: 0.8, ease: 'easeInOut' },
    },
  };

  return (
    <MotionComponent
      className={`hover-reveal-container ${className || ''}`} // Class umum + class tambahan
      onMouseEnter={() => controls.start('hover')}
      onMouseLeave={() => controls.start('exit')}
      {...rest}>
      {/* Lapisan Latar Belakang yang Bergerak */}
      <motion.div
        className='background-fill'
        variants={backgroundVariants}
        initial='initial'
        animate={controls}
        // Reset animasi ke 'initial' setelah selesai keluar
        onAnimationComplete={(definition) => {
          if (definition === 'exit') {
            controls.set('initial'); // Reset tanpa animasi
          }
        }}
      />

      {/* Konten Tombol (Teks) */}
      <div className='label-text'>{children}</div>
    </MotionComponent>
  );
};
