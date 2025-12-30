import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';

// --- SUB-KOMPONEN: ACCORDION ITEM (KHUSUS NON-SAFARI) ---
const AccordionItem = ({ title, isOpen, onClick, children }) => {
  return (
    <div style={{ borderBottom: '1px solid #f1f5f9' }}>
      <button
        onClick={onClick}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: isOpen ? '#f8fafc' : 'white',
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
          textAlign: 'left',
        }}>
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: isOpen ? '#0f172a' : '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
          {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
          ▼
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', background: '#ffffff' }}>
            <div style={{ padding: '8px 16px 16px 16px' }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- KOMPONEN UTAMA ---
const LikeButton = ({ projectId, projectData }) => {
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // State Deteksi Safari
  const [isSafari, setIsSafari] = useState(false);

  // State Menu Custom (Non-Safari)
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null); // 'details' | 'links'
  const menuRef = useRef(null);

  const STORAGE_KEY = `liked_project_${projectId}`;

  // --- 1. SETUP & FETCH ---
  useEffect(() => {
    let isMounted = true;

    // Deteksi Safari
    const ua = navigator.userAgent.toLowerCase();
    const isSafariBrowser =
      ua.includes('safari') &&
      !ua.includes('chrome') &&
      !ua.includes('android');
    setIsSafari(isSafariBrowser);

    // Fetch Data
    const fetchData = async () => {
      try {
        const { count: viewCount } = await supabase
          .from('analytics')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', projectId);
        const { count: likeCount } = await supabase
          .from('project_likes')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', projectId);

        if (isMounted) {
          setViews(viewCount || 0);
          setLikes(likeCount || 0);
          if (localStorage.getItem(STORAGE_KEY) === 'true') setHasLiked(true);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) setLoading(false);
      }
    };
    if (projectId) fetchData();

    // Click Outside Listener (Untuk menutup menu accordion)
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      isMounted = false;
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [projectId, STORAGE_KEY]);

  // --- 2. LOGIC LIKE ---
  const handleLike = async () => {
    if (hasLiked) return;
    setLikes((prev) => prev + 1);
    setHasLiked(true);
    localStorage.setItem(STORAGE_KEY, 'true');
    try {
      let userIp = 'anon-' + Date.now();
      try {
        const r = await fetch('https://api.ipify.org?format=json');
        if (r.ok) userIp = (await r.json()).ip;
      } catch (e) {}
      await supabase
        .from('project_likes')
        .insert([{ project_id: projectId, ip_address: userIp }]);
    } catch (e) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // --- 3. LOGIC SAFARI (NATIVE PICKER) ---
  const handleNativeChange = (e) => {
    const value = e.target.value;
    if (value && (value.startsWith('http') || value.startsWith('https'))) {
      const newWindow = window.open(value, '_blank');
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed == 'undefined'
      ) {
        window.location.href = value;
      }
      setTimeout(() => {
        e.target.value = '';
      }, 500);
    }
  };

  // --- 4. HELPERS ---
  const formatLabel = (key) =>
    key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace('_', ' ');
  const formatValue = (val) => (Array.isArray(val) ? val.join(', ') : val);

  if (loading)
    return <div style={{ fontSize: '0.8rem', color: '#888' }}>...</div>;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginTop: '3rem',
        padding: '1rem 1rem 1rem 1.5rem',
        backgroundColor: '#eae4dcff',
        borderRadius: '40px',
        position: 'relative',
        justifyContent: 'space-between',
      }}>
      {/* VIEW COUNT */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#666',
          fontSize: '0.9rem',
        }}>
        <svg
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
          <circle
            cx='12'
            cy='12'
            r='3'></circle>
        </svg>
        <span>{views.toLocaleString()}</span>
      </div>

      {/* LIKE BUTTON */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleLike}
        disabled={hasLiked}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: hasLiked ? '#ff4757' : '#dad4cdff',
          color: hasLiked ? 'white' : '#2f3542',
          border: 'none',
          padding: '13px 40px',
          borderRadius: '50px',
          fontWeight: '600',
          fontSize: '0.9rem',
          cursor: hasLiked ? 'default' : 'pointer',
          outline: 'none',
          boxShadow: hasLiked ? '0 4px 12px rgba(255, 71, 87, 0.3)' : 'none',
          transition: 'all 0.3s ease',
        }}>
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill={hasLiked ? 'white' : 'none'}
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'></path>
        </svg>
        <span>{likes.toLocaleString()}</span>
      </motion.button>

      {/* --- MOBILE OPTIONS (HYBRID) --- */}
      <div
        className='mobile-dots-wrapper'
        ref={menuRef}>
        {/* === TOMBOL DOTS (TRIGGER) === */}
        <div
          className='dots-icon'
          onClick={() => !isSafari && setMenuOpen(!menuOpen)} // Non-safari trigger menu
        >
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <circle
              cx='12'
              cy='12'
              r='1'></circle>
            <circle
              cx='12'
              cy='5'
              r='1'></circle>
            <circle
              cx='12'
              cy='19'
              r='1'></circle>
          </svg>
        </div>

        {/* === CABANG 1: SAFARI (NATIVE PICKER) === */}
        {isSafari && (
          <select
            className='native-select-overlay'
            onChange={handleNativeChange}
            defaultValue=''>
            <option
              value=''
              disabled
              hidden>
              Options
            </option>
            {projectData && (
              <optgroup label='PROJECT DETAILS'>
                {projectData.details &&
                  Object.entries(projectData.details).map(([key, value]) => (
                    <option
                      key={key}
                      value=''
                      disabled>
                      {formatLabel(key)}: {formatValue(value)}
                    </option>
                  ))}
              </optgroup>
            )}
            {projectData && (
              <optgroup label='LINKS'>
                {projectData.repoLink && (
                  <option value={projectData.repoLink}>Open Repository</option>
                )}
                {projectData.notionLink && (
                  <option value={projectData.notionLink}>
                    Open Documentation
                  </option>
                )}
                {projectData.externalLink && (
                  <option value={projectData.externalLink}>
                    Open Live Demo
                  </option>
                )}
                {projectData.emergencyLink && (
                  <option value={projectData.emergencyLink}>
                    Emergency Backup
                  </option>
                )}
              </optgroup>
            )}
          </select>
        )}

        {/* === CABANG 2: NON-SAFARI (CUSTOM ACCORDION DROPDOWN) === */}
        {!isSafari && (
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className='custom-accordion-menu'>
                {/* 1. Accordion Details */}
                <AccordionItem
                  title='Project Details'
                  isOpen={activeAccordion === 'details'}
                  onClick={() =>
                    setActiveAccordion(
                      activeAccordion === 'details' ? null : 'details'
                    )
                  }>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}>
                    {projectData?.details &&
                      Object.entries(projectData.details).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '0.8rem',
                            }}>
                            <span style={{ color: '#64748b' }}>
                              {formatLabel(key)}
                            </span>
                            <span
                              style={{
                                fontWeight: 500,
                                color: '#334155',
                                textAlign: 'right',
                              }}>
                              {formatValue(value)}
                            </span>
                          </div>
                        )
                      )}
                  </div>
                </AccordionItem>

                {/* 2. Accordion Links */}
                <AccordionItem
                  title='Links'
                  isOpen={activeAccordion === 'links'}
                  onClick={() =>
                    setActiveAccordion(
                      activeAccordion === 'links' ? null : 'links'
                    )
                  }>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}>
                    {[
                      { l: 'Repository', u: projectData?.repoLink },
                      { l: 'Documentation', u: projectData?.notionLink },
                      { l: 'Live Demo', u: projectData?.externalLink },
                      { l: 'Emergency Backup', u: projectData?.emergencyLink },
                    ].map(
                      (link, i) =>
                        link.u && (
                          <a
                            key={i}
                            href={link.u}
                            target='_blank'
                            rel='noreferrer'
                            style={{
                              textDecoration: 'none',
                              color: '#3b82f6',
                              fontSize: '0.85rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              padding: '4px 0',
                            }}>
                            <span>{link.l}</span>
                            <span>↗</span>
                          </a>
                        )
                    )}
                  </div>
                </AccordionItem>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* STYLES */}
      <style>{`
        .mobile-dots-wrapper {
          position: relative;
          width: 40px; height: 40px;
          display: flex; alignItems: center; justifyContent: center;
        }
        .dots-icon { 
          color: #64748b; display: flex; 
          cursor: pointer; /* Penting untuk non-safari */
          margin-top: 7px;
        }
        
        /* Safari Overlay */
        .native-select-overlay {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          opacity: 0; cursor: pointer; appearance: none; z-index: 10;
        }

        /* Non-Safari Accordion Dropdown */
        .custom-accordion-menu {
          position: absolute;
          bottom: 120%; /* Muncul di atas tombol */
          right: 0;
          width: 260px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          overflow: hidden;
          z-index: 9999;
          text-align: left;
        }

        @media (min-width: 768px) {
          .mobile-dots-wrapper { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default LikeButton;
