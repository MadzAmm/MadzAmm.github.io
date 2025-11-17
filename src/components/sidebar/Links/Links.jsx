import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import Magnetic from '../../DateBubble/Magnetic';

const MotionNavLink = motion(NavLink);

// transisi muncul link sidebar
const variants = {
  open: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};
const itemVariants = {
  open: {
    x: 0,
    opacity: 1,
  },
  closed: {
    x: 100,
    opacity: 0,
  },
};

// 1. Definisikan link sosial Anda sebagai array objek
// Ganti "..." dengan URL profil Anda yang sebenarnya
const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/muhafasy',
  },
  {
    name: 'Github',
    url: 'https://github.com/MadzAmm/', // <-- Ganti ini
  },
  {
    name: 'Threads',
    url: 'https://www.threads.com/@muhafasy',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/madz-am-664983394',
  },
];

// MODIFIKASI: Terima props `items` dari Sidebar
const Links = ({ items, setOpen, open, onLinkClick }) => {
  // MODIFIKASI: Hapus array 'items' yang statis (hardcoded).
  // const items = ['homepage', 'services', 'portfolio', 'contact', 'about']; // <-- BARIS INI DIHAPUS

  return (
    <motion.div
      className='links'
      variants={variants}
      initial='closed'
      animate={open ? 'open' : 'closed'}>
      <motion.div
        className='navigation'
        variants={itemVariants}>
        <h3>NAVIGATION</h3>
      </motion.div>

      {/* MODIFIKASI: .map() sekarang menggunakan 'items' dari props secara dinamis */}
      {items.map((item) => {
        const path =
          item.toLowerCase() === 'homepage' ? '/' : `/${item.toLowerCase()}`;
        return (
          <motion.div
            key={item}
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            className='nav-item'>
            <Magnetic
              pullForceParent={0.5}
              pullForceChild={0.25}>
              <MotionNavLink
                to={path}
                onClick={() => {
                  onLinkClick(); // 1. Beri sinyal ke Navbar
                  setOpen(false); // 2. Tutup sidebar
                }}
                className={({ isActive }) =>
                  isActive ? 'link active' : 'link'
                }>
                <div
                  className='slot-viewport'
                  data-text={item}>
                  <span className='slot-text'>{item}</span>
                </div>
              </MotionNavLink>
            </Magnetic>
          </motion.div>
        );
      })}

      {/* Bagian Socials dimodifikasi */}
      <motion.div
        className='social'
        variants={itemVariants}>
        <h3>SOCIALS</h3>
        <div className='linkSocial'>
          {/* 2. Gunakan array 'socialLinks' yang baru untuk di-map */}
          {socialLinks.map((social) => (
            <Magnetic
              key={social.name} // Gunakan .name sebagai key
              pullForceParent={0.5}
              pullForceChild={0.25}>
              <motion.a
                href={social.url} // <-- 3. Gunakan .url untuk href
                target='_blank' // Tambahkan ini agar link terbuka di tab baru
                rel='noopener noreferrer' // Praktik terbaik untuk keamanan
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.85 }}>
                <div
                  className='slot-viewport'
                  data-text={social.name} // <-- 4. Gunakan .name untuk data-text
                >
                  <span className='slot-text'>{social.name}</span>{' '}
                  {/* Gunakan .name untuk teks */}
                </div>
              </motion.a>
            </Magnetic>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Links;
