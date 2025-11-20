import './app.scss';
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/navbar/Navbar';
import Homepage from './pages/Homepage';
import ServicesPage from './pages/ServicesPage';
import PortfolioPage from './pages/PortfolioPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import { ChatProvider, useChat } from './context/ChatContext';
import ChatToggleSidebar from './components/ChatToggleSidebar/ChatToggleSidebar';
import SpeechBubble from './components/SpeechBubble/SpeechBubble';
import UserInputBar from './components/UserInputBar/UserInputBar';

const formatPathToName = (path) => {
  const text = path.replace('/', '') || 'homepage';
  return text.charAt(0).toUpperCase() + text.slice(1);
};
// --- Komponen "Pembungkus" (Wrapper) ---
// Komponen ini akan membaca 'isChatActive' dari Context
// dan memutuskan apakah akan me-render UI Chat atau tidak.
const AppWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // === SEMUA LOGIKA STATE DIPINDAHKAN KE SINI DARI NAVBAR ===
  const allNavItems = ['Homepage', 'Portfolio', 'Contact', 'About'];

  const [currentLink, setCurrentLink] = useState(
    formatPathToName(location.pathname)
  );
  const [recentLink, setRecentLink] = useState(null);
  const [currentLinkPosition, setCurrentLinkPosition] = useState(0);

  const navFromSidebar = useRef(false);

  const markNavFromSidebar = () => {
    navFromSidebar.current = true;
  };

  useEffect(() => {
    const newLink = formatPathToName(location.pathname);
    if (newLink !== currentLink) {
      const updateState = () => {
        setRecentLink(currentLink);
        setCurrentLink(newLink);
        setCurrentLinkPosition((prevPos) => 1 - prevPos);
        navFromSidebar.current = false;
      };

      if (navFromSidebar.current) {
        setTimeout(updateState, 500); // Tunda jika dari sidebar
      } else {
        updateState(); // Langsung jika dari toggle
      }
    }
  }, [location.pathname, currentLink]);

  // Fungsi navigasi utama
  const handleNavigate = (targetLink) => {
    if (!targetLink || targetLink === currentLink) return;
    const path =
      targetLink.toLowerCase() === 'homepage'
        ? '/'
        : `/${targetLink.toLowerCase()}`;
    navigate(path);
  };

  // Kumpulkan semua state dan fungsi untuk dikirim ke bawah
  const navState = {
    allNavItems,
    currentLink,
    recentLink,
    currentLinkPosition,
    handleNavigate,
    markNavFromSidebar,
  };
  // === AKHIR DARI LOGIKA STATE ===

  // Ambil "Master Switch" dari Context
  const { isChatActive } = useChat();

  return (
    <div>
      <Navbar navState={navState} />

      {/* 'Toggle Sidebar' ("Genius Bubble") akan selalu ada */}
      <ChatToggleSidebar />

      <AnimatePresence mode='wait'>
        <Routes
          location={location}
          key={location.pathname}>
          <Route
            path='/'
            element={<Homepage navState={navState} />}
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
