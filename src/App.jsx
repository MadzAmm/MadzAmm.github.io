// import './app.scss';
// import { Routes, Route, useLocation } from 'react-router-dom';
// import { AnimatePresence } from 'framer-motion';
// import Navbar from './components/navbar/Navbar';
// import Homepage from './pages/Homepage';
// import ServicesPage from './pages/ServicesPage'; // <- Halaman induk
// import PortfolioPage from './pages/PortfolioPage';
// import ContactPage from './pages/ContactPage';
// import AboutPage from './pages/AboutPage';

// export default function App() {
//   const location = useLocation();

//   return (
//     <div>
//       <Navbar /> {/* Tetap global */}
//       <AnimatePresence mode='wait'>
//         <Routes
//           location={location}
//           key={location.pathname}>
//           <Route
//             path='/'
//             element={<Homepage />}
//           />

//           {/* Rute ini untuk halaman '/services' utama Anda */}
//           <Route
//             path='/services'
//             element={<ServicesPage />}
//           />

//           {/* --- TAMBAHAN DI SINI --- */}
//           {/* Rute dinamis untuk setiap detail proyek. */}
//           {/* Ini akan me-render ServicesPage, yang kemudian */}
//           {/* akan me-render ProjectPage di dalamnya. */}
//           <Route
//             path='/project/:projectId'
//             element={<ServicesPage />}
//           />
//           {/* ------------------------ */}

//           <Route
//             path='/portfolio'
//             element={<PortfolioPage />}
//           />
//           <Route
//             path='/contact'
//             element={<ContactPage />}
//           />
//           <Route
//             path='/about'
//             element={<AboutPage />}
//           />
//         </Routes>
//       </AnimatePresence>
//     </div>
//   );
// }

// File: App.js (atau file root Anda)

// // Impor standar Anda
// import './app.scss';
// import { Routes, Route, useLocation } from 'react-router-dom';
// import { AnimatePresence } from 'framer-motion';
// import Navbar from './components/navbar/Navbar';
// import Homepage from './pages/Homepage';
// import ServicesPage from './pages/ServicesPage';
// import PortfolioPage from './pages/PortfolioPage';
// import ContactPage from './pages/ContactPage';
// import AboutPage from './pages/AboutPage';

// // ==========================================================
// // --- BAGIAN 1: IMPOR BARU ---
// // (Pastikan path/lokasi file-nya benar)
// // ==========================================================
// import { ChatProvider } from './context/ChatContext';
// import UserInputBar from './components/UserInputBar/UserInputBar';
// import './components/UserInputBar/UserInputBar.scss';
// import SpeechBubble from './components/SpeechBubble/SpeechBubble';
// import './components/SpeechBubble/SpeechBubble.scss';
// // (Pastikan Anda sudah menginstal react-icons: npm install react-icons)

// export default function App() {
//   const location = useLocation();

//   return (
//     // ==========================================================
//     // --- BAGIAN 2: "BUNGKUS" DENGAN PROVIDER ---
//     // (Ini membuat semua komponen di dalamnya bisa "berbicara"
//     //  ke pusat kontrol)
//     // ==========================================================
//     <ChatProvider>
//       <div>
//         <Navbar /> {/* Tetap global */}
//         <AnimatePresence mode='wait'>
//           <Routes
//             location={location}
//             key={location.pathname}>
//             {/* SEMUA RUTE (ROUTE) ANDA TETAP SAMA.
//               (DateBubble yang ada di dalam <Homepage />, <AboutPage />, dll.
//               sekarang secara otomatis bisa mengakses 'useChat()'
//               karena sudah dibungkus oleh <ChatProvider />)
//             */}
//             <Route
//               path='/'
//               element={<Homepage />}
//             />
//             <Route
//               path='/services'
//               element={<ServicesPage />}
//             />
//             <Route
//               path='/project/:projectId'
//               element={<ServicesPage />}
//             />
//             <Route
//               path='/portfolio'
//               element={<PortfolioPage />}
//             />
//             <Route
//               path='/contact'
//               element={<ContactPage />}
//             />
//             <Route
//               path='/about'
//               element={<AboutPage />}
//             />
//           </Routes>
//         </AnimatePresence>
//         {/* ========================================================== */}
//         {/* --- BAGIAN 3: TAMBAHKAN PANEL INPUT GLOBAL --- */}
//         {/* (Kita taruh di sini agar ia 'fixed' di bawah
//             dan tidak ikut animasi ganti halaman) */}
//         {/* ========================================================== */}
//         <UserInputBar />
//       </div>
//     </ChatProvider>
//   );
// }

// File: App.js

import './app.scss';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/navbar/Navbar';
import Homepage from './pages/Homepage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage'; // Pastikan impor ini benar

// --- 1. IMPOR BARU ---
import { ChatProvider, useChat } from './context/ChatContext';
import ChatToggleSidebar from './components/ChatToggleSidebar/ChatToggleSidebar';
import SpeechBubble from './components/SpeechBubble/SpeechBubble';
import UserInputBar from './components/UserInputBar/UserInputBar';

// --- Komponen "Pembungkus" (Wrapper) Baru ---
// Komponen ini akan membaca 'isChatActive' dari Context
// dan memutuskan apakah akan me-render UI Chat atau tidak.
const AppWrapper = () => {
  const location = useLocation();

  // Ambil "Master Switch" dari Context
  const { isChatActive } = useChat();

  return (
    <div>
      <Navbar />

      {/* 'Toggle Sidebar' ("Genius Bubble") akan selalu ada */}
      <ChatToggleSidebar />

      <AnimatePresence mode='wait'>
        <Routes
          location={location}
          key={location.pathname}>
          {/* SEMUA HALAMAN ANDA (Homepage, AboutPage, dll.)
            SEKARANG MEMILIKI AKSES ke 'useChat()'
            Jadi, 'DateBubble' di dalamnya akan bereaksi
            terhadap 'isChatActive'.
          */}
          <Route
            path='/'
            element={<Homepage />}
          />
          <Route
            path='/services'
            element={<ServicesPage />}
          />
          <Route
            path='/project/:projectId'
            element={<ServicesPage />}
          />
          <Route
            path='/portfolio'
            element={<PortfolioPage />}
          />
          <Route
            path='/contact'
            element={<ContactPage />}
          />
          <Route
            path='/about'
            element={<AboutPage />}
          />
        </Routes>
      </AnimatePresence>

      {/* HANYA RENDER komponen UI Chat
        jika "Sesi Chat Aktif"
      */}
      <AnimatePresence>
        {isChatActive && (
          <>
            <SpeechBubble />
            <UserInputBar />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Komponen App Utama (Hanya membungkus Provider) ---
export default function App() {
  return (
    <ChatProvider>
      <AppWrapper />
    </ChatProvider>
  );
}
