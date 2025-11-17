import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import InteractiveToggle from './InteractiveToggle';
import './navbar.scss';

// MODIFIKASI: Nama fungsi diubah agar lebih jelas
// const formatPathToName = (path) => {
//   const text = path.replace('/', '') || 'homepage';
//   return text.charAt(0).toUpperCase() + text.slice(1);
// };

const Navbar = ({ navState }) => {
  // const location = useLocation();
  // const navigate = useNavigate();

  const {
    allNavItems,
    currentLink,
    recentLink,
    currentLinkPosition,
    handleNavigate,
    markNavFromSidebar,
  } = navState;

  // 1. Buat state baru. Default-nya 'false' (tersembunyi)
  //    jika di Homepage, atau 'true' jika di halaman lain.
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    currentLink !== 'Homepage'
  );

  useEffect(() => {
    // 2. Tentukan apa yang harus dilakukan saat 'currentLink' berubah
    if (currentLink !== 'Homepage') {
      // Jika kita TIDAK di Homepage, langsung tampilkan.
      setIsSidebarVisible(true);
      return; // Hentikan eksekusi
    }

    // 3. Jika KITA DI HOMEPAGE, tambahkan event listener

    // Berdasarkan layout Anda, Blok 8 berakhir di 80% dari tinggi layar
    // (10% * 8 blok = 80%)
    const triggerPoint = window.innerHeight * 0.8;

    const handleScroll = () => {
      // Tampilkan jika scroll melewati 80% tinggi viewport
      if (window.scrollY > triggerPoint) {
        setIsSidebarVisible(true);
      } else {
        setIsSidebarVisible(false);
      }
    };

    // Panggil sekali saat memuat untuk memeriksa posisi (jika user me-refresh)
    handleScroll();

    // Tambahkan listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 4. Cleanup: Hapus listener saat komponen unmount atau link berubah
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentLink]); // <-- Efek ini bergantung pada 'currentLink'

  // // TAMBAHKAN: Daftar master semua item navigasi sebagai satu-satunya sumber kebenaran.
  // const allNavItems = ['Homepage', 'Portfolio', 'Contact', 'About'];

  // const [currentLink, setCurrentLink] = React.useState(
  //   formatPathToName(location.pathname)
  // );
  // const [recentLink, setRecentLink] = React.useState(null);

  // // State untuk posisi toggle tidak perlu diubah, sudah benar.
  // const [currentLinkPosition, setCurrentLinkPosition] = React.useState(0);

  // // "Penanda" untuk mengetahui asal navigasi
  // const navFromSidebar = React.useRef(false);

  // //Fungsi untuk mengaktifkan penanda, yang akan kita kirim ke bawah
  // const markNavFromSidebar = () => {
  //   navFromSidebar.current = true;
  // };

  // React.useEffect(() => {
  //   const newLink = formatPathToName(location.pathname);
  //   if (newLink !== currentLink) {
  //     //Periksa apakah penanda aktif
  //     if (navFromSidebar.current) {
  //       // Jika ya, tunda pembaruan state link
  //       setTimeout(() => {
  //         setRecentLink(currentLink);
  //         setCurrentLink(newLink);
  //         setCurrentLinkPosition((prevPos) => 1 - prevPos);
  //       }, 500);
  //       navFromSidebar.current = false;
  //     } else {
  //       // Jika tidak, perbarui state secara instan (untuk navigasi dari InteractiveToggle)
  //       setRecentLink(currentLink);
  //       setCurrentLink(newLink);
  //       setCurrentLinkPosition((prevPos) => 1 - prevPos);
  //     }
  //   }
  // }, [location.pathname, currentLink]);

  // const handleNavigate = (targetLink) => {
  //   if (!targetLink || targetLink === currentLink) return;
  //   const path =
  //     targetLink.toLowerCase() === 'homepage'
  //       ? '/'
  //       : `/${targetLink.toLowerCase()}`;
  //   navigate(path);
  // };

  // TAMBAHKAN: Logika untuk memfilter link yang akan ditampilkan di sidebar.
  const sidebarLinksToShow = allNavItems.filter(
    (item) => item !== currentLink && item !== recentLink
  );

  return (
    <div className='navbar'>
      <InteractiveToggle
        currentLink={currentLink}
        recentLink={recentLink}
        currentLinkPosition={currentLinkPosition}
        onNavigate={handleNavigate}
      />

      {/* MODIFIKASI: Kirim link yang sudah difilter ke Sidebar melalui props */}
      <Sidebar
        itemsForLinks={sidebarLinksToShow}
        onLinkClick={markNavFromSidebar}
        isVisible={isSidebarVisible}
      />
    </div>
  );
};

export default Navbar;
