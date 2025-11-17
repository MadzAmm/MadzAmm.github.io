import { useState } from 'react';
import { motion } from 'framer-motion';
import Links from './Links/Links';
import './sidebar.scss';
import ToogleButton from './toogleButton/ToogleButton';

const variants = {
  open: {
    clipPath: 'circle(2000px at calc(100% - 50px) 50px)', //2000px kalau mau full layar
    transition: { type: 'spring', stiffness: 50, damping: 10 },
  },
  closed: {
    clipPath: 'circle(0 at calc(100% - 50px) 50px)',
    transition: { delay: 0, type: 'spring', stiffness: 300, damping: 40 },
  },
};

const visibilityVariants = {
  visible: {
    opacity: 1,
    y: 0,
    scale: 1, // Muncul ke ukuran penuh
    transition: {
      type: 'spring', // Ini akan memberikan efek 'kenyal'
      stiffness: 400, // Seberapa kaku pegasnya
      damping: 25, // Seberapa cepat berhenti memantul
    },
  },
  hidden: {
    opacity: 0,
    y: 0,
    scale: 0.4, // Mengecil sedikit saat tersembunyi
    transition: {
      ease: 'easeOut',
      duration: 0.2,
    },
  },
};

// MODIFIKASI: Terima props `itemsForLinks` dari Navbar
const Sidebar = ({
  itemsForLinks,
  onLinkClick,
  onNavigateRequest,
  isVisible,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className='sidebar'
      // animate={open ? 'open' : 'closed'}
      variants={visibilityVariants} // <-- Terapkan varian visibilitas
      animate={isVisible ? 'visible' : 'hidden'} // <-- Kontrol dengan prop 'isVisible'
      initial='hidden'>
      {/* Mulai dalam keadaan tersembunyi */}
      <motion.div
        className='bg'
        animate={open ? 'open' : 'closed'}
        variants={variants}
        whileTap={{
          scale: [1, 0.99, 1],
          transition: { duration: 0.4 },
        }}>
        {/* MODIFIKASI: Teruskan props ke komponen Links */}
        <Links
          items={itemsForLinks}
          onNavigate={onNavigateRequest}
          onLinkClick={onLinkClick}
          setOpen={setOpen}
          open={open}
        />
      </motion.div>
      <ToogleButton
        setOpen={setOpen}
        open={open}
      />
    </motion.div>
  );
};

export default Sidebar;
