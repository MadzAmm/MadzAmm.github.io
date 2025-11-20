import { useState, useEffect } from 'react'; // 1. Import hook
import { motion } from 'framer-motion';
import { useChat } from '../../context/ChatContext';
import './ChatToggleSidebar.scss';

export default function ChatToggleSidebar() {
  const { isChatActive, setIsChatActive } = useChat();

  // 2. State untuk melacak apakah kita berada di paling atas halaman
  // Inisialisasi state berdasarkan posisi scroll saat ini
  const [isAtTop, setIsAtTop] = useState(window.scrollY === 0);

  // 3. Effect untuk menambahkan dan membersihkan event listener
  useEffect(() => {
    // Fungsi yang akan dijalankan saat user scroll
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0); // Set true HANYA jika scroll di posisi 0
    };

    // Tambahkan event listener saat komponen di-mount
    window.addEventListener('scroll', handleScroll);

    // Bersihkan event listener saat komponen di-unmount (penting!)
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Array kosong [] berarti effect ini hanya berjalan sekali (saat mount)

  if (isChatActive) {
    return null;
  }

  return (
    <motion.div
      className='chat-toggle-sidebar'
      onClick={() => setIsChatActive(true)}
      initial={{ x: 100 }}
      animate={{ x: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 100, damping: 15 }}>
      {/* 4. Tampilkan teks HANYA JIKA isAtTop bernilai true */}
      {isAtTop && (
        <motion.span
          animate={{ x: [0, -5, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}>
          Tap to ask anything &gt;
        </motion.span>
      )}

      <div className='tab'>Break The Limits</div>
    </motion.div>
  );
}
